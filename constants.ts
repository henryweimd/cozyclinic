import { PatientCase, Item, PlayerState } from './types';

export const INITIAL_PLAYER_STATE: PlayerState = {
  playerName: "Dr. Newbie",
  level: 1,
  levelTitle: "Pre-med",
  currentXp: 0,
  xpToNextLevel: 100,
  coins: 50,
  inventory: [],
  activeBuffs: []
};

export const LEVEL_TITLES = [
  "Pre-med",
  "Med Student",
  "Intern",
  "Resident",
  "Chief Resident",
  "Attending",
  "Department Chair"
];

export const VENDING_MACHINE_ITEMS: Item[] = [
  // --- Consumables (Cheap, Immediate Gratification) ---
  {
    id: 'item_coffee_sparkle',
    name: 'Sparkle Espresso',
    type: 'CONSUMABLE',
    description: 'Instant energy! (+20 XP for the next case)',
    cost: 25,
    icon: '☕',
    effect: 'xp_boost_20',
    tags: ['general', 'energy']
  },
  {
    id: 'item_tea_green',
    name: 'Zen Green Tea',
    type: 'CONSUMABLE',
    description: 'Focus your mind. (Slows timer - aesthetic)',
    cost: 15,
    icon: '🍵',
    tags: ['general', 'calm']
  },
  {
    id: 'item_donut_glazed',
    name: 'Magic Donut',
    type: 'CONSUMABLE',
    description: 'A sweet treat. (+10 Coins next case)',
    cost: 20,
    icon: '🍩',
    effect: 'coin_boost_10',
    tags: ['general', 'food']
  },

  // --- Tools (Mid-Tier, Strategic Buffs) ---
  {
    id: 'item_pillow_cozy',
    name: 'Cozy Pillow',
    type: 'TOOL',
    description: 'Softest dreams. Unlocks Cozy Mode.',
    cost: 50,
    icon: '🛌',
    tags: ['general', 'tool', 'cozy']
  },
  {
    id: 'item_stethoscope_gold',
    name: 'Golden Stethoscope',
    type: 'TOOL',
    description: 'Hear murmurs from across the room. (+10% Coin Reward)',
    cost: 150,
    icon: '🩺',
    effect: 'coin_boost_10',
    tags: ['cardio', 'tool']
  },
  {
    id: 'item_reflex_hammer_sparkle',
    name: 'Glitter Hammer',
    type: 'TOOL',
    description: 'Perfect reflexes every time. (Neuro buff)',
    cost: 80,
    icon: '🔨',
    effect: 'neuro_boost',
    tags: ['neurology', 'tool']
  },
  {
    id: 'item_otoscope_pro',
    name: 'Pro Otoscope',
    type: 'TOOL',
    description: 'See eardrums clearly. (+15% XP in Peds)',
    cost: 90,
    icon: '🔦',
    effect: 'peds_boost_15',
    tags: ['pediatrics', 'tool', 'ent']
  },
  {
    id: 'item_dermatoscope',
    name: 'Magnifying Lens',
    type: 'TOOL',
    description: 'Analyze rashes with precision. (Derm buff)',
    cost: 110,
    icon: '🔍',
    tags: ['dermatology', 'tool']
  },
  {
    id: 'item_wrist_brace_cool',
    name: 'Pro Gamer Brace',
    type: 'TOOL',
    description: 'Demonstrate proper ergonomics. (+XP Ortho)',
    cost: 75,
    icon: '🧤',
    tags: ['orthopedics', 'tool']
  },
  {
    id: 'item_pulse_ox',
    name: 'Bunny Pulse Ox',
    type: 'TOOL',
    description: 'Check oxygen saturation instantly. (+XP Pulm)',
    cost: 65,
    icon: '📟',
    tags: ['pulmonology', 'tool']
  },
  {
    id: 'item_probiotics',
    name: 'Super Probiotics',
    type: 'CONSUMABLE',
    description: 'Healthy gut, healthy life. (+Coins Gastro)',
    cost: 45,
    icon: 'microbe', // lucide doesn't have microbe, using fallback or emoji
    tags: ['gastro', 'consumable']
  },
  {
    id: 'item_epipen_trainer',
    name: 'Epi Trainer',
    type: 'TOOL',
    description: 'Practice safe injections. (+XP Allergy)',
    cost: 70,
    icon: '💉',
    tags: ['allergy', 'tool']
  },

  // --- Cosmetic / High Tier (Long Term Goals) ---
  {
    id: 'item_scrubs_pink',
    name: 'Kawaii Pink Scrubs',
    type: 'COSMETIC',
    description: 'Look cute while saving lives!',
    cost: 250,
    icon: '👚',
    tags: ['cosmetic', 'general']
  },
  {
    id: 'item_mask_cat',
    name: 'Cat Face Mask',
    type: 'COSMETIC',
    description: 'Meow! (+5 Charisma)',
    cost: 120,
    icon: '😷',
    tags: ['cosmetic', 'infectious']
  },
  {
    id: 'item_ultrasound',
    name: 'Pocket Ultrasound',
    type: 'TOOL',
    description: 'See beneath the surface. Unlocks imaging hints.',
    cost: 500,
    icon: '📱',
    tags: ['general', 'imaging']
  },
  {
    id: 'item_diploma_frame',
    name: 'Gold Frame',
    type: 'COSMETIC',
    description: 'Show off your degree in style.',
    cost: 1000,
    icon: '🎓',
    tags: ['cosmetic', 'endgame']
  }
];

export const INITIAL_CASES: PatientCase[] = [
  // CASE 1: Migraine (Neuro)
  {
    id: 'case_007',
    patientName: 'Ms. Aura',
    patientAge: '28 yo',
    patientVisual: '🤕 A stylish lady wearing sunglasses indoors.',
    medicalTheme: 'Neurology',
    chiefComplaint: '"My head is pounding on one side!"',
    hpi: 'Patient reports pulsating headache on left side for 4 hours. Nausea present. States "light hurts my eyes".',
    physicalExam: 'Cranial nerves II-XII intact. Significant [Photophobia|Sensitivity to light] and [Phonophobia|Sensitivity to sound]. No neck stiffness.',
    vitals: { hr: '88 bpm', bp: '125/80', rr: '18', temp: '37.1°C', o2: '99%' },
    imagePrompt: 'A medical illustration of a migraine headache showing a glowing red pulse on one side of a kawaii character head, dark background',
    choices: [], 
    variants: {
        regular: {
            chiefComplaint: '"My head is pounding on one side!"',
            hpi: 'Patient reports pulsating headache on left side for 4 hours. Nausea present. States "light hurts my eyes".',
            physicalExam: 'Cranial nerves II-XII intact. Significant [Photophobia|Sensitivity to light] and [Phonophobia|Sensitivity to sound]. No neck stiffness.',
            choices: [
                {
                    id: 'c2',
                    text: 'Order a CT Head immediately.',
                    type: 'ACCEPTABLE',
                    feedback: 'Not strictly necessary for a classic migraine with normal neuro exam, but rules out bleeds if you are unsure.',
                    coinReward: 20,
                    xpReward: 10
                },
                {
                    id: 'c1',
                    text: 'Administer Sumatriptan and place in dark room.',
                    type: 'GOLD',
                    feedback: 'Correct! Triptans are abortive therapy for migraines. Environment control (dark/quiet) is essential.',
                    coinReward: 60,
                    xpReward: 50
                },
                {
                    id: 'c3',
                    text: 'Prescribe strong opioids.',
                    type: 'DANGEROUS',
                    feedback: 'No! Opioids often cause rebound headaches and are not first-line for migraine.',
                    coinReward: 0,
                    xpReward: 0
                },
                {
                    id: 'c4',
                    text: 'Tell her to drink water and go home.',
                    type: 'SUBOPTIMAL',
                    feedback: 'Hydration helps, but this is a severe migraine. She needs actual treatment.',
                    coinReward: 5,
                    xpReward: 5
                }
            ]
        },
        cozy: {
            chiefComplaint: '"My head hurts a lot on one side!"',
            hpi: 'She has a pulsing pain on the left side of her head. It started 4 hours ago. She feels sick to her stomach, and bright lights hurt her eyes.',
            physicalExam: 'Her brain function looks normal. However, she squints and turns away from light because it hurts. Her neck moves easily (no stiffness).',
            choices: [
                {
                    id: 'c4',
                    text: 'Just give water and send her home.',
                    type: 'SUBOPTIMAL',
                    feedback: 'Water is good, but she is in a lot of pain. We should offer real medicine to help her feel better.',
                    coinReward: 5,
                    xpReward: 5
                },
                {
                    id: 'c1',
                    text: 'Give Sumatriptan (migraine medicine) and let her rest in a dark, quiet room.',
                    type: 'GOLD',
                    feedback: 'Yes! Triptans work well to stop migraines. Resting in a dark room helps the medicine work better.',
                    coinReward: 60,
                    xpReward: 50
                },
                {
                    id: 'c3',
                    text: 'Give strong opioid pain killers.',
                    type: 'DANGEROUS',
                    feedback: 'Be careful! Opioids are very strong and can actually make headaches come back worse later. They are not the best choice here.',
                    coinReward: 0,
                    xpReward: 0
                },
                {
                    id: 'c2',
                    text: 'Take a picture of her brain (CT Scan).',
                    type: 'ACCEPTABLE',
                    feedback: 'A brain scan is usually for injuries or sudden new headaches. Since this sounds like a classic migraine, we likely do not need the radiation.',
                    coinReward: 20,
                    xpReward: 10
                }
            ]
        }
    },
    authoritativeLink: 'https://americanmigrainefoundation.org/resource-library/what-is-migraine/'
  },

  // CASE 2: Appendicitis (Peds)
  {
    id: 'case_001',
    patientName: 'Daisy Puff',
    patientAge: '7 yo',
    patientVisual: '👧 A small girl hugging a giant plush bunny.',
    medicalTheme: 'Pediatrics',
    chiefComplaint: '"My tummy hurts and I feel hot!"',
    hpi: 'Mom reports 2 days of periumbilical pain that migrated to the RLQ this morning. Anorexia and nausea present.',
    vitals: { hr: '110 bpm', bp: '100/65', rr: '22', temp: '38.5°C', o2: '99%' },
    labs: ['WBC: 16.5k', 'CRP: Elevated'],
    physicalExam: 'Positive [McBurney\'s point tenderness|Pain in lower right abdomen]. Positive [Rovsing\'s sign|Pain in right side when pressing left side]. Guarding present.',
    choices: [],
    variants: {
        regular: {
            chiefComplaint: '"My tummy hurts and I feel hot!"',
            hpi: 'Mom reports 2 days of periumbilical pain that migrated to the RLQ this morning. Anorexia and nausea present.',
            physicalExam: 'Positive [McBurney\'s point tenderness|Pain in lower right abdomen]. Positive [Rovsing\'s sign|Pain in right side when pressing left side]. Guarding present.',
            choices: [
                {
                    id: 'c2',
                    text: 'Order an abdominal Ultrasound.',
                    type: 'ACCEPTABLE',
                    feedback: 'Good thought. Ultrasound is great for kids to avoid radiation, but don\'t delay the surgical consult too long!',
                    coinReward: 25,
                    xpReward: 20
                },
                {
                    id: 'c1',
                    text: 'Consult Pediatric Surgery for suspected Appendicitis.',
                    type: 'GOLD',
                    feedback: 'Excellent! The classic migration of pain + exam findings strongly suggests appendicitis. Surgical consult is priority.',
                    coinReward: 50,
                    xpReward: 40
                },
                {
                    id: 'c3',
                    text: 'Prescribe laxatives and send home.',
                    type: 'DANGEROUS',
                    feedback: 'Oh no! Laxatives can cause an inflamed appendix to rupture. Never give laxatives for undiagnosed abdominal pain!',
                    coinReward: 0,
                    xpReward: 0
                },
                {
                    id: 'c4',
                    text: 'Tell her to eat more fiber.',
                    type: 'SUBOPTIMAL',
                    feedback: 'While fiber is good, this misses the acute surgical emergency. This is not simple constipation.',
                    coinReward: 5,
                    xpReward: 5
                }
            ]
        },
        cozy: {
            chiefComplaint: '"My belly hurts really bad!"',
            hpi: 'The pain started around her belly button but has moved to the lower right side. She does not want to eat and feels sick.',
            physicalExam: 'Her stomach is very sore when touched on the bottom right side. She tightens her tummy muscles (guarding) because it hurts.',
            choices: [
                {
                    id: 'c1',
                    text: 'Call the surgeons (doctors who fix bodies) to check for Appendicitis.',
                    type: 'GOLD',
                    feedback: 'Perfect. The way the pain moved to the right side is a big clue. The appendix (a tiny tube in the gut) is likely infected.',
                    coinReward: 50,
                    xpReward: 40
                },
                {
                    id: 'c3',
                    text: 'Give her medicine to help her poop (laxatives).',
                    type: 'DANGEROUS',
                    feedback: 'Do not do that! If her appendix is infected, that medicine could make it burst. Dangerous!',
                    coinReward: 0,
                    xpReward: 0
                },
                {
                    id: 'c2',
                    text: 'Take a picture of her tummy with sound waves (Ultrasound).',
                    type: 'ACCEPTABLE',
                    feedback: 'That is a safe way to look inside without radiation. But we should also get the surgeons ready.',
                    coinReward: 25,
                    xpReward: 20
                },
                {
                    id: 'c4',
                    text: 'Tell her to eat more vegetables.',
                    type: 'SUBOPTIMAL',
                    feedback: 'Vegetables are healthy, but this is an emergency. Food won\'t fix an infection.',
                    coinReward: 5,
                    xpReward: 5
                }
            ]
        }
    },
    authoritativeLink: 'https://www.statpearls.com/ArticleLibrary/viewarticle/17796'
  },

  // CASE 3: Orthostasis (Cardio)
  {
    id: 'case_002',
    patientName: 'Mr. Whiskers',
    patientAge: '68 yo',
    patientVisual: '👴 A gentle grandpa with a thick mustache.',
    medicalTheme: 'Cardiology',
    chiefComplaint: '"I felt dizzy when I stood up."',
    hpi: 'Patient started a new blood pressure medication (Alpha-blocker) yesterday. Reports lightheadedness upon standing.',
    vitals: { hr: '85 bpm', bp: '130/80 (sitting) -> 100/60 (standing)', rr: '16', temp: '37.0°C', o2: '98%' },
    physicalExam: 'Cardiovascular exam normal. [Orthostatic hypotension|Drop in BP when standing] confirmed.',
    choices: [],
    variants: {
        regular: {
            chiefComplaint: '"I felt dizzy when I stood up."',
            hpi: 'Patient started a new blood pressure medication (Alpha-blocker) yesterday. Reports lightheadedness upon standing.',
            physicalExam: 'Cardiovascular exam normal. [Orthostatic hypotension|Drop in BP when standing] confirmed.',
            choices: [
                {
                    id: 'c2',
                    text: 'Immediately stop all BP medications.',
                    type: 'SUBOPTIMAL',
                    feedback: 'Stopping everything might cause rebound hypertension. Better to adjust timing or dose first.',
                    coinReward: 10,
                    xpReward: 10
                },
                {
                    id: 'c1',
                    text: 'Advise taking meds at night; stand slowly.',
                    type: 'GOLD',
                    feedback: 'Perfect! Taking alpha-blockers at night minimizes fall risk, and behavioral changes help manage orthostasis.',
                    coinReward: 50,
                    xpReward: 40
                },
                {
                    id: 'c4',
                    text: 'Prescribe salt tablets immediately.',
                    type: 'ACCEPTABLE',
                    feedback: 'Fluid and salt can help, but managing the medication culprit is the primary step.',
                    coinReward: 20,
                    xpReward: 15
                },
                {
                    id: 'c3',
                    text: 'Order a brain MRI.',
                    type: 'SUBOPTIMAL',
                    feedback: 'That is an expensive workup for a likely medication side effect. History points clearly to the new med.',
                    coinReward: 5,
                    xpReward: 5
                }
            ]
        },
        cozy: {
            chiefComplaint: '"I get dizzy when I stand up!"',
            hpi: 'He started a new medicine for his blood pressure yesterday. Now, the room spins if he stands up too fast.',
            physicalExam: 'His heart sounds fine. However, we checked his blood pressure while he was standing, and it dropped too low.',
            choices: [
                {
                    id: 'c4',
                    text: 'Tell him to eat more salt.',
                    type: 'ACCEPTABLE',
                    feedback: 'Salt can raise blood pressure, which helps, but we should fix how he takes the medicine first.',
                    coinReward: 20,
                    xpReward: 15
                },
                {
                    id: 'c2',
                    text: 'Tell him to stop taking all his heart medicine.',
                    type: 'SUBOPTIMAL',
                    feedback: 'If he stops everything, his blood pressure might go too high. We just need to adjust it.',
                    coinReward: 10,
                    xpReward: 10
                },
                {
                    id: 'c1',
                    text: 'Tell him to take his medicine at bedtime and stand up slowly.',
                    type: 'GOLD',
                    feedback: 'Smart choice! If he sleeps through the strongest effect of the medicine, he won\'t get dizzy and fall.',
                    coinReward: 50,
                    xpReward: 40
                },
                {
                    id: 'c3',
                    text: 'Scan his brain (MRI).',
                    type: 'SUBOPTIMAL',
                    feedback: 'We know the dizziness is from the new medicine. A brain scan is very expensive and probably not needed.',
                    coinReward: 5,
                    xpReward: 5
                }
            ]
        }
    },
    authoritativeLink: 'https://www.mayoclinic.org/diseases-conditions/orthostatic-hypotension/symptoms-causes/syc-20352548'
  },

  // CASE 4: Mono (Infectious)
  {
    id: 'case_003',
    patientName: 'K-Pop Stan',
    patientAge: '19 yo',
    patientVisual: '🎤 A student with purple hair holding a lightstick.',
    medicalTheme: 'Infectious',
    chiefComplaint: '"My throat hurts so bad!"',
    hpi: '3 days of sore throat, fever, and fatigue. No cough. Partner has similar symptoms.',
    vitals: { hr: '90 bpm', bp: '115/75', rr: '18', temp: '38.9°C', o2: '99%' },
    labs: ['Monospot: Positive', 'WBC: 14k (Lymphocytosis)'],
    physicalExam: 'Significant [Posterior cervical lymphadenopathy|Swollen lymph nodes behind neck]. Tonsillar exudates. Splenomegaly.',
    choices: [],
    variants: {
        regular: {
            chiefComplaint: '"My throat hurts so bad!"',
            hpi: '3 days of sore throat, fever, and fatigue. No cough. Partner has similar symptoms.',
            physicalExam: 'Significant [Posterior cervical lymphadenopathy|Swollen lymph nodes behind neck]. Tonsillar exudates. Splenomegaly.',
            choices: [
                {
                    id: 'c2',
                    text: 'Prescribe Amoxicillin immediately.',
                    type: 'DANGEROUS',
                    feedback: 'Watch out! If this is Mono, Amoxicillin can cause a nasty full-body rash. Confirm diagnosis first.',
                    coinReward: 0,
                    xpReward: 0
                },
                {
                    id: 'c3',
                    text: 'Rapid Strep Test only.',
                    type: 'ACCEPTABLE',
                    feedback: 'Reasonable to rule out Strep, but the posterior nodes and spleen strongly point to Mono. You might miss the diagnosis.',
                    coinReward: 25,
                    xpReward: 20
                },
                {
                    id: 'c1',
                    text: 'Diagnose Mono; advise no contact sports.',
                    type: 'GOLD',
                    feedback: 'Spot on! The triad of fever, tonsillitis, and lymphadenopathy + enlarged spleen suggests Mononucleosis. Protecting the spleen is critical.',
                    coinReward: 50,
                    xpReward: 40
                },
                {
                    id: 'c4',
                    text: 'Recommend warm tea and vocal rest.',
                    type: 'SUBOPTIMAL',
                    feedback: 'Supportive care is good, but you missed the splenomegaly risk! They need specific warnings about rupture.',
                    coinReward: 10,
                    xpReward: 10
                }
            ]
        },
        cozy: {
            chiefComplaint: '"My throat hurts and I am so tired!"',
            hpi: 'They have a fever and sore throat. They feel exhausted. Their partner is also sick.',
            physicalExam: 'The glands in the back of their neck are big. Their spleen (an organ in the belly) is swollen.',
            choices: [
                {
                    id: 'c1',
                    text: 'It is Mono (Kissing Disease). No sports allowed!',
                    type: 'GOLD',
                    feedback: 'Correct! Mono makes the spleen swell up like a balloon. If they get hit in sports, it could burst!',
                    coinReward: 50,
                    xpReward: 40
                },
                {
                    id: 'c2',
                    text: 'Give standard antibiotics (Amoxicillin).',
                    type: 'DANGEROUS',
                    feedback: 'Bad idea! Giving that medicine to someone with Mono causes a huge, itchy rash.',
                    coinReward: 0,
                    xpReward: 0
                },
                {
                    id: 'c4',
                    text: 'Drink tea and rest the voice.',
                    type: 'SUBOPTIMAL',
                    feedback: 'Tea is nice, but you forgot to warn them about sports! Their spleen is in danger.',
                    coinReward: 10,
                    xpReward: 10
                },
                {
                    id: 'c3',
                    text: 'Check for Strep Throat.',
                    type: 'ACCEPTABLE',
                    feedback: 'Checking for Strep is okay, but this really looks like Mono because of the swollen neck glands.',
                    coinReward: 25,
                    xpReward: 20
                }
            ]
        }
    },
    authoritativeLink: 'https://www.cdc.gov/epstein-barr/about-mono.html'
  },

  // CASE 5: Lyme (Derm)
  {
    id: 'case_004',
    patientName: 'Sk8r Boi',
    patientAge: '22 yo',
    patientVisual: '🛹 A young man with scrapes on his knees.',
    medicalTheme: 'Dermatology',
    chiefComplaint: '"This rash on my arm is weird."',
    hpi: 'Noticed a target-like red spot on arm 3 days after a hiking trip in Connecticut. Mild fatigue.',
    vitals: { hr: '76 bpm', bp: '120/80', rr: '14', temp: '37.2°C', o2: '100%' },
    physicalExam: 'Single 5cm erythematous lesion with central clearing (Bull\'s eye). No tick found.',
    imagePrompt: 'A close up medical illustration of Erythema Migrans, a bullseye rash on a pale arm, kawaii style but medically accurate',
    choices: [],
    variants: {
        regular: {
            chiefComplaint: '"This rash on my arm is weird."',
            hpi: 'Noticed a target-like red spot on arm 3 days after a hiking trip in Connecticut. Mild fatigue.',
            physicalExam: 'Single 5cm erythematous lesion with central clearing (Bull\'s eye). No tick found.',
            choices: [
                {
                    id: 'c3',
                    text: 'Apply hydrocortisone cream.',
                    type: 'DANGEROUS',
                    feedback: 'This is an infection, not eczema! Steroids can worsen untreated infections.',
                    coinReward: 0,
                    xpReward: 0
                },
                {
                    id: 'c1',
                    text: 'Diagnose Lyme Disease; start Doxycycline.',
                    type: 'GOLD',
                    feedback: 'Correct. Erythema Migrans is pathognomonic for Lyme. Early antibiotic treatment prevents chronic complications.',
                    coinReward: 50,
                    xpReward: 45
                },
                {
                    id: 'c2',
                    text: 'Wait for Lyme Titer results before treating.',
                    type: 'SUBOPTIMAL',
                    feedback: 'Early Lyme tests are often negative! Treat based on the rash (clinical diagnosis).',
                    coinReward: 10,
                    xpReward: 10
                },
                {
                    id: 'c4',
                    text: 'Reassure it is a spider bite.',
                    type: 'DANGEROUS',
                    feedback: 'Missing Lyme disease can lead to heart block or facial palsy. Don\'t dismiss the Bull\'s eye!',
                    coinReward: 0,
                    xpReward: 0
                }
            ]
        },
        cozy: {
            chiefComplaint: '"I have a weird circle rash on my arm."',
            hpi: 'He went hiking in the woods 3 days ago. Now he has a red rash that looks like a target or bullseye.',
            physicalExam: 'A red circle with a clear center (Bullseye Rash). We did not find a bug on him.',
            choices: [
                {
                    id: 'c2',
                    text: 'Wait for blood tests to come back.',
                    type: 'SUBOPTIMAL',
                    feedback: 'Tests for Lyme disease are often negative in the first week. We should trust our eyes and treat the rash now.',
                    coinReward: 10,
                    xpReward: 10
                },
                {
                    id: 'c1',
                    text: 'It is Lyme Disease. Give antibiotics right away.',
                    type: 'GOLD',
                    feedback: 'Exactly. That bullseye rash is the hallmark of Lyme Disease. Antibiotics kill the bacteria before it spreads.',
                    coinReward: 50,
                    xpReward: 45
                },
                {
                    id: 'c4',
                    text: 'Tell him it is just a spider bite.',
                    type: 'DANGEROUS',
                    feedback: 'Spider bites hurt! This rash is from a tick. If we miss it, he could get heart problems later.',
                    coinReward: 0,
                    xpReward: 0
                },
                {
                    id: 'c3',
                    text: 'Put anti-itch cream on it.',
                    type: 'DANGEROUS',
                    feedback: 'This is not just an itch! It is a serious infection. Cream won\'t stop the bacteria.',
                    coinReward: 0,
                    xpReward: 0
                }
            ]
        }
    },
    authoritativeLink: 'https://www.cdc.gov/lyme/signs_symptoms/index.html'
  },

  // CASE 6: GERD (Gastro)
  {
    id: 'case_005',
    patientName: 'Chef Gnocchi',
    patientAge: '45 yo',
    patientVisual: '👨‍🍳 A chef in a white coat holding a ladle.',
    medicalTheme: 'Gastro',
    chiefComplaint: '"My chest burns after I eat my special sauce."',
    hpi: 'Burning retrosternal pain worse when lying down. Chronic cough at night. Uses many tomatoes/spices.',
    vitals: { hr: '80 bpm', bp: '135/85', rr: '16', temp: '36.8°C', o2: '98%' },
    physicalExam: 'Abdomen soft, non-tender. [Epigastric|Upper central abdomen] discomfort on deep palpation. Lungs clear.',
    choices: [],
    variants: {
        regular: {
            chiefComplaint: '"My chest burns after I eat my special sauce."',
            hpi: 'Burning retrosternal pain worse when lying down. Chronic cough at night. Uses many tomatoes/spices.',
            physicalExam: 'Abdomen soft, non-tender. [Epigastric|Upper central abdomen] discomfort on deep palpation. Lungs clear.',
            choices: [
                {
                    id: 'c2',
                    text: 'Immediate Endoscopy (EGD).',
                    type: 'ACCEPTABLE',
                    feedback: 'A bit aggressive for uncomplicated GERD with no alarm symptoms (weight loss, bleeding).',
                    coinReward: 20,
                    xpReward: 15
                },
                {
                    id: 'c1',
                    text: 'Trial PPIs and lifestyle changes (elevate head).',
                    type: 'GOLD',
                    feedback: 'Excellent. Classic GERD symptoms. Lifestyle mod + PPI is the standard initial therapy.',
                    coinReward: 45,
                    xpReward: 40
                },
                {
                    id: 'c4',
                    text: 'Order a cardiac workup immediately.',
                    type: 'ACCEPTABLE',
                    feedback: 'Safe thought, as heart attacks can mimic heartburn, but history strongly favors GERD.',
                    coinReward: 25,
                    xpReward: 10
                },
                {
                    id: 'c3',
                    text: 'Prescribe antibiotics for H. Pylori.',
                    type: 'SUBOPTIMAL',
                    feedback: 'You need to test for H. Pylori before treating it! Don\'t misuse antibiotics.',
                    coinReward: 5,
                    xpReward: 5
                }
            ]
        },
        cozy: {
            chiefComplaint: '"My chest is on fire after I eat!"',
            hpi: 'He feels burning in his chest, especially if he lies down after eating spicy tomato sauce. He coughs a lot at night.',
            physicalExam: 'His belly is soft but feels a little uncomfortable at the very top. His lungs sound clear.',
            choices: [
                {
                    id: 'c3',
                    text: 'Give antibiotics for bacteria.',
                    type: 'SUBOPTIMAL',
                    feedback: 'We don\'t know if he has bacteria! We shouldn\'t give antibiotics unless we are sure.',
                    coinReward: 5,
                    xpReward: 5
                },
                {
                    id: 'c2',
                    text: 'Put a camera down his throat (Endoscopy).',
                    type: 'ACCEPTABLE',
                    feedback: 'That would show us exactly what is wrong, but we can probably fix it with simple medicine first.',
                    coinReward: 20,
                    xpReward: 15
                },
                {
                    id: 'c1',
                    text: 'It is Acid Reflux. Give acid-lowering medicine and tell him not to lie down after eating.',
                    type: 'GOLD',
                    feedback: 'Spot on. The spicy food and lying down are causing stomach acid to go up his throat. Medicine helps!',
                    coinReward: 45,
                    xpReward: 40
                },
                {
                    id: 'c4',
                    text: 'Check his heart right away.',
                    type: 'ACCEPTABLE',
                    feedback: 'It is smart to be careful because heart pain can feel like heartburn. But this really sounds like it comes from food.',
                    coinReward: 25,
                    xpReward: 10
                }
            ]
        }
    },
    authoritativeLink: 'https://gi.org/topics/acid-reflux/'
  },

  // CASE 7: Asthma (Pulm)
  {
    id: 'case_006',
    patientName: 'Ms. Frizzle',
    patientAge: '30 yo',
    patientVisual: '👩‍🏫 A teacher with wild orange hair.',
    medicalTheme: 'Pulmonology',
    chiefComplaint: '"I can\'t catch my breath during recess."',
    hpi: 'Shortness of breath and wheezing triggered by cold air and exercise. History of eczema as a child.',
    vitals: { hr: '92 bpm', bp: '118/76', rr: '20', temp: '37.0°C', o2: '96%' },
    labs: ['Peak Flow: 70% of predicted', 'Eosinophils: Elevated'],
    physicalExam: 'General appearance anxious. Auscultation reveals [End-expiratory wheezes|High pitched whistling sounds] bilaterally.',
    choices: [],
    variants: {
        regular: {
            chiefComplaint: '"I can\'t catch my breath during recess."',
            hpi: 'Shortness of breath and wheezing triggered by cold air and exercise. History of eczema as a child.',
            physicalExam: 'General appearance anxious. Auscultation reveals [End-expiratory wheezes|High pitched whistling sounds] bilaterally.',
            choices: [
                {
                    id: 'c1',
                    text: 'Prescribe Albuterol inhaler prn and discuss Asthma.',
                    type: 'GOLD',
                    feedback: 'Correct. The triad of Atopy (eczema), triggers, and wheezing confirms Asthma. SABA is first line.',
                    coinReward: 50,
                    xpReward: 40
                },
                {
                    id: 'c2',
                    text: 'Prescribe antibiotics for Pneumonia.',
                    type: 'SUBOPTIMAL',
                    feedback: 'No fever, no crackles, no productive cough. This is reactive airway disease, not infection.',
                    coinReward: 5,
                    xpReward: 5
                },
                {
                    id: 'c3',
                    text: 'Send to ER for intubation.',
                    type: 'DANGEROUS',
                    feedback: 'Whoa! She is stable with O2 96%. Start with an inhaler before jumping to life support!',
                    coinReward: 0,
                    xpReward: 0
                },
                {
                    id: 'c4',
                    text: 'Advise her to stop teaching.',
                    type: 'SUBOPTIMAL',
                    feedback: 'That is extreme! Asthma is manageable. Don\'t ruin her career.',
                    coinReward: 5,
                    xpReward: 0
                }
            ]
        },
        cozy: {
            chiefComplaint: '"It is hard to breathe when I run outside!"',
            hpi: 'Cold air and exercise make her wheeze. She had bad skin rashes (eczema) as a kid.',
            physicalExam: 'She looks nervous. When we listen to her lungs, we hear a high-pitched whistling sound.',
            choices: [
                {
                    id: 'c4',
                    text: 'Tell her to never go outside again.',
                    type: 'SUBOPTIMAL',
                    feedback: 'She can still go outside! She just needs medicine to manage her asthma.',
                    coinReward: 5,
                    xpReward: 0
                },
                {
                    id: 'c3',
                    text: 'Put a breathing tube down her throat immediately.',
                    type: 'DANGEROUS',
                    feedback: 'Too extreme! She is awake and breathing okay. She just needs a little help, not a machine.',
                    coinReward: 0,
                    xpReward: 0
                },
                {
                    id: 'c1',
                    text: 'It is Asthma. Give her an inhaler (puffer) to help her breathe.',
                    type: 'GOLD',
                    feedback: 'Perfect! Her breathing tubes are getting tight. The inhaler opens them up so she can breathe easily.',
                    coinReward: 50,
                    xpReward: 40
                },
                {
                    id: 'c2',
                    text: 'Give antibiotics for pneumonia.',
                    type: 'SUBOPTIMAL',
                    feedback: 'She doesn\'t have a fever or infection signs. This is an airway problem, not a germ problem.',
                    coinReward: 5,
                    xpReward: 5
                }
            ]
        }
    },
    authoritativeLink: 'https://www.nhlbi.nih.gov/health/asthma'
  },

  // CASE 8: Anaphylaxis (Allergy)
  {
    id: 'case_008',
    patientName: 'Nutty Professor',
    patientAge: '35 yo',
    patientVisual: '🥜 A squirrel mascot with a swollen face.',
    medicalTheme: 'Allergy',
    chiefComplaint: '"I think... I ate... a peanut..."',
    hpi: 'Patient accidentally ingested peanut sauce. 5 mins later developed lip swelling and difficulty swallowing.',
    vitals: { hr: '120 bpm', bp: '90/60', rr: '28', temp: '37.0°C', o2: '92%' },
    physicalExam: '[Angioedema|Swelling] of lips. Audible [Stridor|High-pitched sound when breathing in]. Diffuse hives.',
    choices: [],
    variants: {
        regular: {
            chiefComplaint: '"I think... I ate... a peanut..."',
            hpi: 'Patient accidentally ingested peanut sauce. 5 mins later developed lip swelling and difficulty swallowing.',
            physicalExam: '[Angioedema|Swelling] of lips. Audible [Stridor|High-pitched sound when breathing in]. Diffuse hives.',
            choices: [
                {
                    id: 'c4',
                    text: 'Order a peanut allergy test.',
                    type: 'SUBOPTIMAL',
                    feedback: 'We know he is allergic! He is dying right now. Test later, treat now.',
                    coinReward: 0,
                    xpReward: 0
                },
                {
                    id: 'c2',
                    text: 'Give oral Benadryl and wait.',
                    type: 'DANGEROUS',
                    feedback: 'Dangerous! Pills take too long to work and don\'t stop throat closure. He needs Epi!',
                    coinReward: 0,
                    xpReward: 0
                },
                {
                    id: 'c1',
                    text: 'Administer IM Epinephrine immediately.',
                    type: 'GOLD',
                    feedback: 'Correct! This is Anaphylaxis (ABC compromise). Epinephrine is the only life-saving medication here.',
                    coinReward: 60,
                    xpReward: 55
                },
                {
                    id: 'c3',
                    text: 'Start an IV and give fluids.',
                    type: 'ACCEPTABLE',
                    feedback: 'Fluids help the low blood pressure, but they do NOT fix the airway swelling. Epi comes first.',
                    coinReward: 30,
                    xpReward: 10
                }
            ]
        },
        cozy: {
            chiefComplaint: '"My throat feels tight... I ate a peanut..."',
            hpi: 'He ate peanut sauce by mistake. 5 minutes later, his lips got huge and he can\'t swallow well.',
            physicalExam: 'His lips are very swollen. He makes a scary squeaking noise when he breathes in (Stridor).',
            choices: [
                {
                    id: 'c1',
                    text: 'Use the EpiPen (Epinephrine) right away!',
                    type: 'GOLD',
                    feedback: 'Yes! This is a life-threatening allergic reaction. The EpiPen stops the swelling and opens his airway.',
                    coinReward: 60,
                    xpReward: 55
                },
                {
                    id: 'c3',
                    text: 'Give him water to drink.',
                    type: 'DANGEROUS',
                    feedback: 'He can\'t swallow! He might choke. We need to fix his breathing first.',
                    coinReward: 0,
                    xpReward: 0
                },
                {
                    id: 'c2',
                    text: 'Give him an allergy pill (Benadryl).',
                    type: 'DANGEROUS',
                    feedback: 'No! Pills are too slow. His throat is closing up. He needs the shot immediately.',
                    coinReward: 0,
                    xpReward: 0
                },
                {
                    id: 'c4',
                    text: 'Ask him what brand of peanuts he ate.',
                    type: 'SUBOPTIMAL',
                    feedback: 'It doesn\'t matter! We need to save his life first.',
                    coinReward: 0,
                    xpReward: 0
                }
            ]
        }
    },
    authoritativeLink: 'https://www.aaaai.org/conditions-treatments/allergies/anaphylaxis'
  },

  // CASE 9: Carpal Tunnel (Orthopedics)
  {
    id: 'case_009',
    patientName: 'Gamer Chad',
    patientAge: '24 yo',
    patientVisual: '🎮 A guy in a hoodie holding a controller.',
    medicalTheme: 'Orthopedics',
    chiefComplaint: '"My thumb and fingers are numb."',
    hpi: 'Professional gamer. Plays 12 hours/day. Complains of tingling in thumb/index/middle fingers, worse at night.',
    vitals: { hr: '70 bpm', bp: '120/80', rr: '16', temp: '36.9°C', o2: '99%' },
    physicalExam: 'Positive [Phalen\'s test|Numbness when wrists are bent]. Weak thumb abduction. Pinky finger sensation normal.',
    choices: [],
    variants: {
        regular: {
            chiefComplaint: '"My thumb and fingers are numb."',
            hpi: 'Professional gamer. Plays 12 hours/day. Complains of tingling in thumb/index/middle fingers, worse at night.',
            physicalExam: 'Positive [Phalen\'s test|Numbness when wrists are bent]. Weak thumb abduction. Pinky finger sensation normal.',
            choices: [
                {
                    id: 'c1',
                    text: 'Diagnose Carpal Tunnel; prescribe wrist splints.',
                    type: 'GOLD',
                    feedback: 'Correct. Median nerve compression (Carpal Tunnel) spares the pinky. Night splints are first-line therapy.',
                    coinReward: 40,
                    xpReward: 35
                },
                {
                    id: 'c3',
                    text: 'Refer for immediate surgery.',
                    type: 'ACCEPTABLE',
                    feedback: 'Surgery releases the nerve, but we usually try conservative measures (splints) first.',
                    coinReward: 30,
                    xpReward: 20
                },
                {
                    id: 'c4',
                    text: 'Tell him to game more to build strength.',
                    type: 'SUBOPTIMAL',
                    feedback: 'No! Overuse is the cause. He needs rest, not more gaming.',
                    coinReward: 5,
                    xpReward: 5
                },
                {
                    id: 'c2',
                    text: 'Prescribe strong blood thinners.',
                    type: 'DANGEROUS',
                    feedback: 'This is a nerve problem, not a blood clot! Blood thinners are dangerous here.',
                    coinReward: 0,
                    xpReward: 0
                }
            ]
        },
        cozy: {
            chiefComplaint: '"My gaming fingers feel asleep!"',
            hpi: 'He plays video games all day. His thumb and pointer finger are tingling, especially when he sleeps.',
            physicalExam: 'When we bend his wrists, his hand goes numb. His pinky finger feels fine (a clue that it is the middle nerve!).',
            choices: [
                {
                    id: 'c1',
                    text: 'It is Carpal Tunnel. Wear wrist braces at night.',
                    type: 'GOLD',
                    feedback: 'Correct! The nerve in his wrist is getting squished. Braces keep the wrist straight so the nerve can heal.',
                    coinReward: 40,
                    xpReward: 35
                },
                {
                    id: 'c2',
                    text: 'Give medicine to thin his blood.',
                    type: 'DANGEROUS',
                    feedback: 'This is a pinched nerve, not a blood problem. That medicine is dangerous.',
                    coinReward: 0,
                    xpReward: 0
                },
                {
                    id: 'c4',
                    text: 'Tell him to play harder to make his hands strong.',
                    type: 'SUBOPTIMAL',
                    feedback: 'Bad advice! His hands are hurt from playing too much. He needs a break.',
                    coinReward: 5,
                    xpReward: 5
                },
                {
                    id: 'c3',
                    text: 'Do surgery on his hands tomorrow.',
                    type: 'ACCEPTABLE',
                    feedback: 'Surgery can fix it, but usually we try wearing braces and resting first.',
                    coinReward: 30,
                    xpReward: 20
                }
            ]
        }
    },
    authoritativeLink: 'https://orthoinfo.aaos.org/en/diseases--conditions/carpal-tunnel-syndrome/'
  },

  // CASE 10: Otitis Media (Pediatrics)
  {
    id: 'case_010',
    patientName: 'Little Timmy',
    patientAge: '3 yo',
    patientVisual: '👶 A toddler crying and pulling his ear.',
    medicalTheme: 'Pediatrics',
    chiefComplaint: '"He won\'t stop crying!"',
    hpi: 'Mom says he has had a runny nose for a week. Last night he woke up screaming and pulling at his right ear.',
    vitals: { hr: '110 bpm', bp: '95/60', rr: '24', temp: '39.0°C', o2: '98%' },
    physicalExam: 'Right tympanic membrane is [Erythematous|Red] and [Bulging|Pushing outward]. Poor mobility on insufflation.',
    choices: [],
    variants: {
        regular: {
            chiefComplaint: '"He won\'t stop crying!"',
            hpi: 'Mom says he has had a runny nose for a week. Last night he woke up screaming and pulling at his right ear.',
            physicalExam: 'Right tympanic membrane is [Erythematous|Red] and [Bulging|Pushing outward]. Poor mobility on insufflation.',
            choices: [
                {
                    id: 'c4',
                    text: 'Send to ER for meningitis workup.',
                    type: 'ACCEPTABLE',
                    feedback: 'Fever and crying can be meningitis, but the ear exam explains the symptoms perfectly. Likely overkill.',
                    coinReward: 20,
                    xpReward: 10
                },
                {
                    id: 'c1',
                    text: 'Diagnose Acute Otitis Media; prescribe Amoxicillin.',
                    type: 'GOLD',
                    feedback: 'Correct. High fever + bulging eardrum requires antibiotics in this age group.',
                    coinReward: 45,
                    xpReward: 40
                },
                {
                    id: 'c2',
                    text: 'Irrigate ear to remove wax.',
                    type: 'SUBOPTIMAL',
                    feedback: 'The problem is behind the eardrum, not wax in front of it! You might hurt him.',
                    coinReward: 5,
                    xpReward: 5
                },
                {
                    id: 'c3',
                    text: 'Refer to Audiology for hearing aids.',
                    type: 'SUBOPTIMAL',
                    feedback: 'This is an acute infection, not permanent hearing loss.',
                    coinReward: 5,
                    xpReward: 5
                }
            ]
        },
        cozy: {
            chiefComplaint: '"My ear hurts so much!"',
            hpi: 'He had a cold, and now his ear hurts really bad. He keeps pulling on it.',
            physicalExam: 'When we look inside his ear, the eardrum is very red and bulging out like a balloon ready to pop.',
            choices: [
                {
                    id: 'c2',
                    text: 'Try to wash the ear out with water.',
                    type: 'SUBOPTIMAL',
                    feedback: 'Ouch! The infection is on the inside. Washing it won\'t help and will hurt a lot.',
                    coinReward: 5,
                    xpReward: 5
                },
                {
                    id: 'c1',
                    text: 'It is an Ear Infection. Give bubblegum-flavored antibiotics.',
                    type: 'GOLD',
                    feedback: 'Right! There is pus behind the eardrum causing pressure. The medicine will kill the germs.',
                    coinReward: 45,
                    xpReward: 40
                },
                {
                    id: 'c3',
                    text: 'Get him hearing aids.',
                    type: 'SUBOPTIMAL',
                    feedback: 'His hearing is muffled because of the fluid, but it will come back once the infection is gone!',
                    coinReward: 5,
                    xpReward: 5
                },
                {
                    id: 'c4',
                    text: 'Assume it is a brain infection.',
                    type: 'ACCEPTABLE',
                    feedback: 'It is good to be safe, but we can clearly see the ear is the problem. We don\'t need to scare the mom yet.',
                    coinReward: 20,
                    xpReward: 10
                }
            ]
        }
    },
    authoritativeLink: 'https://www.cdc.gov/antibiotic-use/ear-infection.html'
  }
];