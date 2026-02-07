
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PatientCase } from "../types";

const SYSTEM_INSTRUCTION = `
You are the backend engine for Cozy Clinic, a mobile-first medical RPG.
Your task is to generate medically accurate, kawaii-styled patient encounters.
Persona: You are Chief Resident Mimi, the player’s mentor.
Tone: Professional medical educator meets cozy game guide.

Requirements:
1. Patient Scenario: Simple, clear, high-contrast.
2. medicalTheme: One word category.
3. Clinical Data: Succinct Chief Complaint (CC), HPI (max 2 sentences), Vitals.
4. Labs: Optional but good for complexity. Format as strings "Test: Value".
5. Image Prompt: Describe the visual clinical finding for an AI image generator (e.g., 'swollen red knee', 'bullseye rash on arm'). 
   CRITICAL: The prompt MUST be for a visual depiction only. DO NOT ask for diagrams, charts, text overlays, or labels.
6. Choices: 4 distinct options (GOLD, ACCEPTABLE, SUBOPTIMAL, DANGEROUS).
7. Variants: Provide TWO versions of the textual content: 
   - 'regular': Standard medical terminology (e.g., "Photophobia", "Erythema Migrans").
   - 'cozy': Plain English, accessible to laypeople and children. Use real medication names but explain what they do. Avoid excessive baby-talk (no "ouchie" or "boo-boo" unless it's a direct quote from a child). Focus on clarity and analogies (e.g., instead of "Photophobia", say "Lights hurt their eyes").
8. Metadata: Provide an authoritative link and a 'learningTidbit' - a fascinating one-sentence medical fact directly related to the diagnosis (e.g., "The spleen is fragile in Mono, making contact sports dangerous.").
`;

const variantSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    chiefComplaint: { type: Type.STRING },
    hpi: { type: Type.STRING },
    physicalExam: { type: Type.STRING },
    choices: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["GOLD", "ACCEPTABLE", "SUBOPTIMAL", "DANGEROUS"] },
          feedback: { type: Type.STRING },
          coinReward: { type: Type.INTEGER },
          xpReward: { type: Type.INTEGER },
        },
        required: ["id", "text", "type", "feedback", "coinReward", "xpReward"]
      }
    }
  },
  required: ["chiefComplaint", "hpi", "physicalExam", "choices"]
};

const caseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    patientName: { type: Type.STRING },
    patientAge: { type: Type.STRING },
    patientVisual: { type: Type.STRING, description: "A kawaii emoji description of the patient" },
    medicalTheme: { type: Type.STRING, description: "One or two word medical specialty" },
    
    // Legacy/Fallback fields (optional now if variants exist, but good to keep for compatibility)
    chiefComplaint: { type: Type.STRING },
    hpi: { type: Type.STRING },
    physicalExam: { type: Type.STRING },
    choices: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["GOLD", "ACCEPTABLE", "SUBOPTIMAL", "DANGEROUS"] },
          feedback: { type: Type.STRING },
          coinReward: { type: Type.INTEGER },
          xpReward: { type: Type.INTEGER },
        },
        required: ["id", "text", "type", "feedback", "coinReward", "xpReward"]
      }
    },
    
    vitals: {
      type: Type.OBJECT,
      properties: {
        hr: { type: Type.STRING },
        bp: { type: Type.STRING },
        rr: { type: Type.STRING },
        temp: { type: Type.STRING },
        o2: { type: Type.STRING },
      },
      required: ["hr", "bp", "rr", "temp", "o2"]
    },
    labs: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of relevant lab findings, e.g. 'WBC: 12k'"
    },
    imagePrompt: { type: Type.STRING, description: "Description for generating a medical illustration if applicable" },
    
    variants: {
        type: Type.OBJECT,
        properties: {
            regular: variantSchema,
            cozy: variantSchema
        },
        required: ["regular", "cozy"]
    },

    authoritativeLink: { type: Type.STRING },
    learningTidbit: { type: Type.STRING, description: "A one-sentence interesting medical fact about the case." }
  },
  required: ["patientName", "patientAge", "patientVisual", "medicalTheme", "vitals", "variants", "authoritativeLink", "learningTidbit"]
};

export const generateCase = async (playerLevelTitle: string): Promise<PatientCase | null> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key found. Returning null to trigger fallback.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Generate a new medical case for a player at the '${playerLevelTitle}' level. Make it interesting but appropriate for this level. Ensure both Regular and Cozy variants are provided.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: caseSchema,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);
    
    // Ensure fallback fields are populated if the AI only provided variants
    const finalData = {
        ...data,
        chiefComplaint: data.chiefComplaint || data.variants?.regular?.chiefComplaint,
        hpi: data.hpi || data.variants?.regular?.hpi,
        physicalExam: data.physicalExam || data.variants?.regular?.physicalExam,
        choices: data.choices || data.variants?.regular?.choices,
        id: `gen_${Date.now()}`
    };

    return finalData;

  } catch (error) {
    console.error("Failed to generate case:", error);
    return null;
  }
};

export const generateMedicalImage = async (prompt: string): Promise<string | null> => {
  if (!process.env.API_KEY) return null;

  try {
     const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
     
     // Heavily engineered prompt to prevent text generation
     const finalPrompt = `${prompt}. 
     Style: Kawaii medical illustration, clean flat vector art, high contrast, simple solid background.
     IMPORTANT: ABSOLUTELY NO TEXT, NO LABELS, NO WORDS, NO ALPHABET, NO NUMBERS, NO WATERMARKS.
     Focus: Visual clinical sign only.`;

     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: finalPrompt }
          ]
        },
        config: {
            imageConfig: {
                aspectRatio: "16:9", // closest to 21:9 supported
                // imageSize: "1K" // Removed: Not supported for gemini-2.5-flash-image
            }
        }
     });

     // Iterate to find image part
     if (response.candidates?.[0]?.content?.parts) {
         for (const part of response.candidates[0].content.parts) {
             if (part.inlineData) {
                 return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
             }
         }
     }
     return null;
  } catch (e) {
      console.error("Image generation failed", e);
      return null;
  }
}
