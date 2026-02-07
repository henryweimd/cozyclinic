
export type OutcomeType = 'GOLD' | 'ACCEPTABLE' | 'SUBOPTIMAL' | 'DANGEROUS';

export interface Choice {
  id: string;
  text: string;
  type: OutcomeType;
  feedback: string;
  coinReward: number;
  xpReward: number;
}

export interface CaseVariant {
  chiefComplaint: string;
  hpi: string;
  physicalExam: string;
  choices: Choice[];
}

export interface PatientCase {
  id: string;
  patientName: string;
  patientAge: string;
  patientVisual: string;
  medicalTheme: string;
  chiefComplaint: string; // Default/Fallback
  hpi: string; // Default/Fallback
  vitals: {
    hr: string;
    bp: string;
    rr: string;
    temp: string;
    o2: string;
  };
  labs?: string[]; 
  imagePrompt?: string; 
  imageUrl?: string; 
  physicalExam: string; // Default/Fallback
  choices: Choice[]; // Default/Fallback
  variants?: {
      regular: CaseVariant;
      cozy: CaseVariant;
  };
  authoritativeLink?: string;
  learningTidbit?: string;
}

export interface Item {
  id: string;
  name: string;
  type: 'COSMETIC' | 'TOOL' | 'CONSUMABLE';
  description: string;
  cost: number;
  icon: string;
  effect?: string;
  tags?: string[];
}

export interface PlayerState {
  playerName: string;
  level: number;
  levelTitle: string;
  currentXp: number;
  xpToNextLevel: number;
  coins: number;
  inventory: string[];
  activeBuffs: string[];
}

export enum GamePhase {
  START,
  SCENARIO,
  FEEDBACK,
  SHOP,
  LOADING,
  TESTING
}
