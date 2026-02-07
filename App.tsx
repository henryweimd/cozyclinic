
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { GameHeader } from './components/GameHeader';
import { PatientCard } from './components/PatientCard';
import { FeedbackOverlay } from './components/FeedbackOverlay';
import { VendingMachine } from './components/VendingMachine';
import { StartScreen } from './components/StartScreen';
import { TestingScreen } from './components/TestingScreen';
import { 
  PlayerState, 
  PatientCase, 
  Choice, 
  GamePhase, 
  Item 
} from './types';
import { 
  INITIAL_PLAYER_STATE, 
  INITIAL_CASES, 
  VENDING_MACHINE_ITEMS, 
  LEVEL_TITLES 
} from './constants';
import { generateCase, generateMedicalImage } from './services/geminiService';

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.START);
  const [playerState, setPlayerState] = useState<PlayerState>(INITIAL_PLAYER_STATE);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Game Modes - Default to TRUE for Cozy Mode
  const [isCozyMode, setIsCozyMode] = useState(true);
  
  // Case Management
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  
  // Persistent Storage Logic for Generated Cases
  const [generatedCases, setGeneratedCases] = useState<PatientCase[]>(() => {
    try {
      const saved = localStorage.getItem('cozy_clinic_cases');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load cases from persistence", e);
      return [];
    }
  });

  // Save to persistence whenever generatedCases changes
  useEffect(() => {
    try {
      localStorage.setItem('cozy_clinic_cases', JSON.stringify(generatedCases));
    } catch (e) {
      console.error("Failed to save cases to persistence", e);
    }
  }, [generatedCases]);

  const [activeCase, setActiveCase] = useState<PatientCase | null>(null);
  const [lastChoice, setLastChoice] = useState<Choice | null>(null);
  
  // Shop State
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [shopItems, setShopItems] = useState<Item[]>([]);
  const [suggestedItem, setSuggestedItem] = useState<Item | null>(null);
  
  // Loading State
  const [isGenerating, setIsGenerating] = useState(false);

  // --- SESSION INITIALIZATION ---
  useEffect(() => {
    // Check if we have the new Migraine case (case_007) to show off variants
    const startCase = INITIAL_CASES.find(c => c.id === 'case_007') || INITIAL_CASES[0];
    setActiveCase(startCase);
    updateShopInventory(startCase.medicalTheme || "General", false);
  }, []);

  // --- IMAGE GENERATION EFFECT ---
  useEffect(() => {
    const fetchImage = async () => {
        if (activeCase && activeCase.imagePrompt && !activeCase.imageUrl) {
            try {
                const url = await generateMedicalImage(activeCase.imagePrompt);
                if (url) {
                    setActiveCase(prev => prev ? ({ ...prev, imageUrl: url }) : null);
                }
            } catch (e) {
                console.error("Failed to load image", e);
            }
        }
    };
    fetchImage();
  }, [activeCase?.id]); // Only run when case ID changes

  const handleStartGame = (mode: 'normal' | 'demo') => {
    if (mode === 'demo') {
        setIsDemoMode(true);
        setPlayerState({
            ...INITIAL_PLAYER_STATE,
            coins: 5000,
            level: 4,
            levelTitle: "Resident",
            currentXp: 1500,
            xpToNextLevel: 3000
        });
        updateShopInventory("General", true); 
    }
    setPhase(GamePhase.SCENARIO);
  };

  const updateShopInventory = (theme: string, forceDemo: boolean = false) => {
      if (forceDemo || isDemoMode) {
          setShopItems(VENDING_MACHINE_ITEMS);
          return;
      }

      const t = theme.toLowerCase();
      const relevantItems = VENDING_MACHINE_ITEMS.filter(i => 
        i.tags?.some(tag => t.includes(tag))
      );
      const otherItems = VENDING_MACHINE_ITEMS.filter(i => 
        !i.tags?.some(tag => t.includes(tag))
      );
      
      const shuffle = (arr: Item[]) => [...arr].sort(() => 0.5 - Math.random());
      
      let selection: Item[] = [];
      if (relevantItems.length > 0) {
          selection.push(relevantItems[Math.floor(Math.random() * relevantItems.length)]);
      }
      const filled = shuffle(otherItems).slice(0, 3 - selection.length);
      selection = [...selection, ...filled];
      
      selection = Array.from(new Set(selection.map(i => i.id)))
        .map(id => VENDING_MACHINE_ITEMS.find(i => i.id === id)!);

      // Always ensure Cozy Pillow is available if not owned, for the demo of features
      const pillow = VENDING_MACHINE_ITEMS.find(i => i.id === 'item_pillow_cozy');
      if (pillow && !selection.some(i => i.id === pillow.id)) {
          selection[2] = pillow;
      }

      setShopItems(selection);
  };

  useEffect(() => {
    if (isDemoMode) {
        setShopItems(VENDING_MACHINE_ITEMS);
    }
  }, [isDemoMode]);

  const calculateSuggestion = (coins: number, inventory: string[], currentShopItems: Item[]) => {
      const shopSuggestion = currentShopItems.find(i => !inventory.includes(i.id) && coins >= i.cost);
      if (shopSuggestion) return shopSuggestion;

      const globalSuggestion = VENDING_MACHINE_ITEMS.find(i => !inventory.includes(i.id) && coins >= i.cost);
      return globalSuggestion || null;
  };

  const handleMakeChoice = (choice: Choice) => {
    let finalCoinReward = choice.coinReward;
    let finalXpReward = choice.xpReward;

    if (playerState.inventory.includes('item_stethoscope_gold')) {
        finalCoinReward = Math.floor(finalCoinReward * 1.1);
    }
    if (playerState.inventory.includes('item_coffee_sparkle')) {
        finalXpReward += 20;
        setPlayerState(prev => ({
            ...prev,
            inventory: prev.inventory.filter(id => id !== 'item_coffee_sparkle')
        }));
    }

    const newXp = playerState.currentXp + finalXpReward;
    let newLevel = playerState.level;
    let newXpToNext = playerState.xpToNextLevel;
    let newLevelTitle = playerState.levelTitle;
    let newCoins = playerState.coins + finalCoinReward;

    if (newXp >= playerState.xpToNextLevel) {
        newLevel += 1;
        newXpToNext = Math.floor(newXpToNext * 1.5);
        newLevelTitle = LEVEL_TITLES[Math.min(newLevel - 1, LEVEL_TITLES.length - 1)];
        newCoins += 50; 
    }

    const updatedState = {
        ...playerState,
        coins: newCoins,
        currentXp: newXp,
        level: newLevel,
        xpToNextLevel: newXpToNext,
        levelTitle: newLevelTitle
    };
    
    setPlayerState(updatedState);

    const suggestion = calculateSuggestion(newCoins, updatedState.inventory, shopItems);
    setSuggestedItem(suggestion);

    setLastChoice({ ...choice, coinReward: finalCoinReward, xpReward: finalXpReward });
    setPhase(GamePhase.FEEDBACK);

    if (activeCase) {
        updateShopInventory(activeCase.medicalTheme || "General");
    }

    prefetchNextCase(newLevelTitle);
  };

  const prefetchNextCase = useCallback(async (levelTitle: string) => {
      const totalAvailable = INITIAL_CASES.length + generatedCases.length;
      const nextIndex = currentCaseIndex + 1;
      
      if (nextIndex >= totalAvailable && !isGenerating) {
          setIsGenerating(true);
          try {
            const newCase = await generateCase(levelTitle);
            if (newCase) {
                setGeneratedCases(prev => [...prev, newCase]);
            } else {
                const randomRecycle = { ...INITIAL_CASES[Math.floor(Math.random() * INITIAL_CASES.length)] };
                randomRecycle.id = `recycled_${Date.now()}`;
                setGeneratedCases(prev => [...prev, randomRecycle]);
            }
          } catch (e) {
              console.error(e);
          } finally {
              setIsGenerating(false);
          }
      }
  }, [currentCaseIndex, generatedCases.length, isGenerating]);

  // Manual generation logic with timeout for the Testing Screen
  const handleManualGenerate = async () => {
    setIsGenerating(true);
    
    // Create a timeout promise that rejects after 10 seconds
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => {
        console.warn("Manual generation timed out");
        resolve(null); 
      }, 10000);
    });

    try {
      // Race the generation against the timeout
      const newCase = await Promise.race([
        generateCase(playerState.levelTitle),
        timeoutPromise
      ]);

      if (newCase) {
        setGeneratedCases(prev => [newCase, ...prev]);
      } else {
        // Handle timeout or null response (UI will just stop loading)
        // Ideally show a toast, but keeping it simple as requested
      }
    } catch (e) {
      console.error("Manual generation failed", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextCase = () => {
    // Basic logic to pick random or sequential for "Next"
    // Since we want variety, let's try to pick from Generated first, then random Initial
    
    const nextIndex = currentCaseIndex + 1;
    let nextCase: PatientCase;

    // Prioritize generated content if available to keep it fresh
    if (generatedCases.length > 0 && nextIndex % 2 !== 0) { // interleave?
        const genCase = generatedCases.shift(); // consume it? or just index
        // better to just check if we have one ready
        if (genCase) nextCase = genCase;
        else nextCase = INITIAL_CASES[Math.floor(Math.random() * INITIAL_CASES.length)];
    } else {
        // Pick random initial case different from current
        let candidates = INITIAL_CASES.filter(c => c.id !== activeCase?.id);
        nextCase = candidates[Math.floor(Math.random() * candidates.length)];
    }

    // Safety fallback
    if (!nextCase) nextCase = INITIAL_CASES[0];

    setActiveCase(nextCase);
    setCurrentCaseIndex(nextIndex);
    setPhase(GamePhase.SCENARIO);
  };

  const handleBuyItem = (item: Item) => {
    if (playerState.coins >= item.cost) {
        // Special logic for Cozy Pillow
        if (item.id === 'item_pillow_cozy') {
            setIsCozyMode(true);
        }

        setPlayerState(prev => ({
            ...prev,
            coins: prev.coins - item.cost,
            inventory: [...prev.inventory, item.id]
        }));
        if (suggestedItem?.id === item.id) {
            setSuggestedItem(null);
        }
    }
  };

  return (
    <Layout isCozyMode={isCozyMode}>
      {phase === GamePhase.START && (
        <StartScreen onStart={handleStartGame} />
      )}

      {phase === GamePhase.TESTING && (
          <TestingScreen 
            initialCases={INITIAL_CASES}
            generatedCases={generatedCases}
            onBackToStart={() => setPhase(GamePhase.START)}
            onBackToGame={() => setPhase(GamePhase.SCENARIO)}
            onGenerate={handleManualGenerate}
            isGenerating={isGenerating}
          />
      )}

      {phase !== GamePhase.START && phase !== GamePhase.TESTING && (
        <>
           <GameHeader 
                playerState={playerState} 
                onOpenShop={() => setIsShopOpen(true)}
                isCozyMode={isCozyMode}
                onToggleCozyMode={() => setIsCozyMode(prev => !prev)}
           />
           
           <div className={`relative flex-1 flex flex-col overflow-hidden transition-colors duration-700 ease-in-out ${isCozyMode ? 'bg-orange-50/30' : 'bg-slate-50'}`}>
                {activeCase && (
                    <PatientCard 
                        patientCase={activeCase} 
                        onMakeChoice={handleMakeChoice} 
                        isLoading={phase === GamePhase.LOADING}
                        isCozyMode={isCozyMode}
                    />
                )}
           </div>

           {phase === GamePhase.FEEDBACK && lastChoice && activeCase && (
                <FeedbackOverlay 
                    choice={lastChoice} 
                    patientCase={activeCase}
                    onNext={handleNextCase}
                    isLoadingNext={isGenerating && generatedCases.length === 0}
                    suggestedItem={suggestedItem}
                    onBuyItem={handleBuyItem}
                    playerCoins={playerState.coins}
                    isCozyMode={isCozyMode}
                />
           )}

           {isShopOpen && (
               <VendingMachine 
                    items={shopItems}
                    playerState={playerState}
                    onBuy={handleBuyItem}
                    onClose={() => setIsShopOpen(false)}
                    onOpenTesting={() => {
                        setIsShopOpen(false);
                        setPhase(GamePhase.TESTING);
                    }}
               />
           )}
        </>
      )}
    </Layout>
  );
};

export default App;
