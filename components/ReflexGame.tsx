
import React, { useState, useEffect, useRef } from 'react';
import { Syringe, Zap, Trophy, RefreshCw } from 'lucide-react';

interface ReflexGameProps {
  onComplete: (coins: number) => void;
  onInteraction: () => void;
}

export const ReflexGame: React.FC<ReflexGameProps> = ({ onComplete, onInteraction }) => {
  const [gameState, setGameState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [cursorPos, setCursorPos] = useState(0); 
  const [reward, setReward] = useState(0);
  
  // Refs for animation loop state to avoid closure staleness
  const requestRef = useRef<number>();
  const directionRef = useRef<number>(1);
  const posRef = useRef<number>(0);
  const speedRef = useRef<number>(1.2);

  const TARGET_START = 40;
  const TARGET_END = 60;

  useEffect(() => {
    if (gameState === 'running') {
      const animate = () => {
        // Update position
        posRef.current += speedRef.current * directionRef.current;

        // Bounce logic
        if (posRef.current >= 100) {
          posRef.current = 100;
          directionRef.current = -1;
        } else if (posRef.current <= 0) {
          posRef.current = 0;
          directionRef.current = 1;
        }

        setCursorPos(posRef.current);
        requestRef.current = requestAnimationFrame(animate);
      };
      
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState]);

  const handleStart = () => {
    onInteraction();
    setGameState('running');
    setReward(0);
    posRef.current = 0;
    directionRef.current = 1;
    // Randomize speed slightly
    speedRef.current = 1.0 + Math.random() * 1.5; 
  };

  const handleStop = () => {
    onInteraction();
    if (gameState !== 'running') return;

    setGameState('finished');
    
    const current = posRef.current;
    let coins = 0;

    // Hit detection
    if (current >= TARGET_START && current <= TARGET_END) {
        // Perfect center check (48-52)
        if (current >= 48 && current <= 52) {
            coins = 25; // Perfect!
        } else {
            coins = 10; // Good
        }
    } else {
        coins = 0; // Miss
    }

    setReward(coins);
    if (coins > 0) onComplete(coins);
  };

  return (
    <div className="mt-4 bg-indigo-50 rounded-xl p-4 border border-indigo-100 shadow-sm relative overflow-hidden group">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 p-2 opacity-5">
        <Zap size={64} className="text-indigo-900" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1">
                <Syringe size={14} />
                Bonus Mini-Game: IV Calibration
            </h3>
            {gameState === 'finished' && reward > 0 && (
                <span className="text-xs font-bold text-emerald-600 animate-bounce flex items-center gap-1">
                    <Trophy size={12} /> +{reward} Coins!
                </span>
            )}
             {gameState === 'finished' && reward === 0 && (
                <span className="text-xs font-bold text-red-400">
                    Missed!
                </span>
            )}
        </div>

        {/* Game Track */}
        <div className="h-6 bg-slate-200 rounded-full relative mb-3 overflow-hidden border border-slate-300">
            {/* Target Zone */}
            <div 
                className="absolute top-0 bottom-0 bg-emerald-400 opacity-50 border-x border-emerald-500"
                style={{ left: `${TARGET_START}%`, width: `${TARGET_END - TARGET_START}%` }}
            ></div>
            {/* Center Line for precision visual */}
            <div 
                className="absolute top-0 bottom-0 w-0.5 bg-emerald-600 opacity-60 left-1/2 -translate-x-1/2"
            ></div>

            {/* Cursor */}
            <div 
                className="absolute top-0 bottom-0 w-2 bg-pink-500 shadow-md border-x border-white rounded-full transition-transform duration-75 will-change-transform"
                style={{ left: `${cursorPos}%`, transform: 'translateX(-50%)' }}
            ></div>
        </div>

        {/* Controls */}
        <div className="flex justify-center">
            {gameState === 'idle' && (
                <button 
                    onClick={handleStart}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 active:scale-95 transition-all w-full"
                >
                    Start Calibration
                </button>
            )}
            {gameState === 'running' && (
                <button 
                    onMouseDown={handleStop} // MouseDown for faster response than Click
                    className="bg-pink-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-pink-600 active:scale-95 transition-all w-full animate-pulse"
                >
                    INJECT NOW!
                </button>
            )}
            {gameState === 'finished' && (
                <button 
                    onClick={handleStart}
                    className="text-indigo-600 text-xs font-bold hover:text-indigo-800 flex items-center gap-1 px-4 py-2"
                >
                    <RefreshCw size={12} /> Try Again
                </button>
            )}
        </div>
      </div>
    </div>
  );
};
