
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
import { getRecommendedItems, getRandomCase, shuffleCaseChoices } from './utils';

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
    // Start with a specific case to demo features or random
    const startCase = shuffleCaseChoices(INITIAL_CASES[0]);
    setActiveCase(startCase);
    
    // Initial shop population (predictive)
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
        // Force refresh shop for demo
        updateShopInventory("General", true); 
    }
    // Shuffle the current active case again to ensure randomness on start
    if (activeCase) {
        setActiveCase(shuffleCaseChoices(activeCase));
    }
    setPhase(GamePhase.SCENARIO);
  };

  /**
   * Updates shop inventory using Predictive Logic
   */
  const updateShopInventory = (theme: string, forceDemo: boolean = false) => {
      if (forceDemo || isDemoMode) {
          setShopItems(VENDING_MACHINE_ITEMS);
          return;
      }

      // Gather next few cases for prediction
      // 1. Get current index + next 2 from initial/generated pool
      const nextCases: PatientCase[] = [];
      
      // Look at generated queue first
      if (generatedCases.length > 0) {
          nextCases.push(...generatedCases.slice(0, 3));
      }
      
      // If not enough generated, look at Initial Queue (approximate logic since we random pick sometimes)
      // We will just grab 3 random initial cases to simulate "upcoming" diversity
      if (nextCases.length < 3) {
          const randomInitials = [...INITIAL_CASES].sort(() => 0.5 - Math.random()).slice(0, 3 - nextCases.length);
          nextCases.push(...randomInitials);
      }

      // Use the utility function
      const recommendations = getRecommendedItems(
          nextCases, 
          playerState.inventory, 
          VENDING_MACHINE_ITEMS
      );

      // Always ensure Cozy Pillow is available if not owned, for the demo of features
      const pillow = VENDING_MACHINE_ITEMS.find(i => i.id === 'item_pillow_cozy');
      if (pillow && !playerState.inventory.includes(pillow.id) && !recommendations.some(i => i.id === pillow.id)) {
          // Replace the last item (lowest priority)
          if (recommendations.length >= 4) {
              recommendations[3] = pillow;
          } else {
              recommendations.push(pillow);
          }
      }

      setShopItems(recommendations);
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

  const handleLevelUp = (currentXp: number, currentLevel: number, currentXpToNext: number, currentCoins: number, addedCoins: number) => {
      let newXp = currentXp;
      let newLevel = currentLevel;
      let newXpToNext = currentXpToNext;
      let newLevelTitle = LEVEL_TITLES[Math.min(newLevel - 1, LEVEL_TITLES.length - 1)];
      let newCoins = currentCoins + addedCoins;

      if (newXp >= currentXpToNext) {
          newLevel += 1;
          newXpToNext = Math.floor(newXpToNext * 1.5);
          newLevelTitle = LEVEL_TITLES[Math.min(newLevel - 1, LEVEL_TITLES.length - 1)];
          newCoins += 50; 
      }
      return { newXp, newLevel, newXpToNext, newLevelTitle, newCoins };
  };

  const handleMakeChoice = (choice: Choice) => {
    let finalCoinReward = choice.coinReward;
    let finalXpReward = choice.xpReward;

    // Buffs
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

    const { newXp, newLevel, newXpToNext, newLevelTitle, newCoins } = handleLevelUp(
        playerState.currentXp + finalXpReward,
        playerState.level,
        playerState.xpToNextLevel,
        playerState.coins,
        finalCoinReward
    );

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
    
    // Refresh shop based on the *next* projected cases
    if (activeCase) {
        updateShopInventory(activeCase.medicalTheme || "General");
    }

    // Trigger AI generation while user is on Feedback screen
    prefetchNextCase(newLevelTitle);
  };

  // Special handler for Mini-Game Rewards
  const handleMiniGameReward = (coins: number) => {
    setPlayerState(prev => ({
        ...prev,
        coins: prev.coins + coins
    }));
  };

  // Special handler for the "Optimized Path" button (Treat with Item)
  const handleSolveWithItem = () => {
      if (!activeCase?.optimizedResolution) return;

      const resolution = activeCase.optimizedResolution;
      
      const { newXp, newLevel, newXpToNext, newLevelTitle, newCoins } = handleLevelUp(
        playerState.currentXp + resolution.xpReward,
        playerState.level,
        playerState.xpToNextLevel,
        playerState.coins,
        resolution.coinReward
      );

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

      // Create a "Choice" object on the fly to reuse the feedback overlay
      const optimizedChoice: Choice = {
          id: 'optimized_win',
          text: resolution.text,
          type: 'GOLD',
          feedback: resolution.feedback,
          coinReward: resolution.coinReward,
          xpReward: resolution.xpReward
      };

      setLastChoice(optimizedChoice);
      setPhase(GamePhase.FEEDBACK);

      if (activeCase) {
        updateShopInventory(activeCase.medicalTheme || "General");
      }
      prefetchNextCase(newLevelTitle);
  };

  const prefetchNextCase = useCallback(async (levelTitle: string) => {
      // Logic: If we are running low on generated cases, fetch one now
      // This runs in background while user reads feedback
      
      // Limit queue to avoid spamming API
      if (generatedCases.length > 2 || isGenerating) return;

      setIsGenerating(true);
      try {
        const newCase = await generateCase(levelTitle);
        if (newCase) {
            setGeneratedCases(prev => [...prev, newCase]);
        } else {
            // If API fails, we just don't add to queue, 
            // handleNextCase will fallback to random INITIAL_CASES
        }
      } catch (e) {
          console.error(e);
      } finally {
          setIsGenerating(false);
      }
  }, [generatedCases.length, isGenerating]);

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
        // Handle timeout or null response
      }
    } catch (e) {
      console.error("Manual generation failed", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextCase = () => {
    const nextIndex = currentCaseIndex + 1;
    let nextCase: PatientCase;

    // If we have generated cases in the queue, use them
    if (generatedCases.length > 0) { 
        const genCase = generatedCases.shift(); 
        if (genCase) {
          nextCase = genCase;
        } else {
          nextCase = getRandomCase(INITIAL_CASES) || INITIAL_CASES[0];
        }
    } else {
        // Use Weighted Random Selection from Initial Cases
        const randomCase = getRandomCase(INITIAL_CASES);
        
        // Ensure we don't pick the exact same case twice in a row if possible
        if (randomCase && randomCase.id === activeCase?.id && INITIAL_CASES.length > 1) {
             let retries = 3;
             let newRandom = randomCase;
             while (retries > 0 && newRandom.id === activeCase?.id) {
                 newRandom = getRandomCase(INITIAL_CASES) || INITIAL_CASES[0];
                 retries--;
             }
             nextCase = newRandom;
        } else {
             nextCase = randomCase || INITIAL_CASES[0];
        }
    }

    // CRITICAL: Shuffle the answer choices for the new case before displaying
    // This ensures variety even if the same case ID is repeated later
    const shuffledCase = shuffleCaseChoices(nextCase);

    setActiveCase(shuffledCase);
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
            playerState={playerState}
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
                        inventory={playerState.inventory}
                        onSolveWithItem={handleSolveWithItem}
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
                    onMiniGameReward={handleMiniGameReward}
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
