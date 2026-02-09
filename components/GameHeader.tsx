
import React from 'react';
import { PlayerState } from '../types';
import { Heart, Coins, ShoppingBag, Sparkles, Stethoscope } from 'lucide-react';

interface GameHeaderProps {
  playerState: PlayerState;
  onOpenShop: () => void;
  isCozyMode: boolean;
  onToggleCozyMode: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ 
  playerState, 
  onOpenShop,
  isCozyMode,
  onToggleCozyMode
}) => {
  const progressPercent = Math.min(100, (playerState.currentXp / playerState.xpToNextLevel) * 100);

  return (
    <div className="bg-white px-4 py-3 border-b border-pink-100 sticky top-0 z-30 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Level {playerState.level}</span>
          <span className="text-base font-bold text-slate-800">{playerState.levelTitle}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Cozy Toggle */}
          <button
            onClick={onToggleCozyMode}
            className={`flex items-center space-x-1 px-2 py-1.5 rounded-full shadow-sm border transition-all active:scale-95 ${
                isCozyMode 
                ? 'bg-pink-100 border-pink-200 text-pink-600' 
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
            title={isCozyMode ? "Switch to Pro Mode" : "Switch to Cozy Mode"}
          >
             {isCozyMode ? <Sparkles size={14} /> : <Stethoscope size={14} />}
             <span className="text-xs font-bold hidden sm:inline">{isCozyMode ? 'Cozy' : 'Pro'}</span>
          </button>

          <button 
            onClick={onOpenShop}
            className="flex items-center space-x-1 bg-pink-500 hover:bg-pink-600 active:scale-95 transition-all px-3 py-1.5 rounded-full shadow-sm text-white mr-1"
          >
            <ShoppingBag size={14} />
            <span className="text-xs font-bold hidden sm:inline">Shop</span>
          </button>

          <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1.5 rounded-full border border-yellow-200">
            <Coins size={14} className="text-yellow-600" />
            <span className="text-sm font-bold text-yellow-700">{playerState.coins}</span>
          </div>
        </div>
      </div>

      {/* XP Bar */}
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
        <div 
          className="h-full bg-gradient-to-r from-pink-300 to-purple-400 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-bold text-slate-500 drop-shadow-sm">
                {playerState.currentXp} / {playerState.xpToNextLevel} XP
            </span>
        </div>
      </div>
    </div>
  );
};
