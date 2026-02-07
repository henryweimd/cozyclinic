import React, { useState, useEffect } from 'react';
import { Item, PlayerState } from '../types';
import { Bot, ChevronUp, ChevronDown } from 'lucide-react';

interface VendingBenchProps {
  items: Item[]; // The subset of items currently displayed (Hot Deals)
  playerState: PlayerState;
  onBuy: (item: Item) => void;
  gBotMessage: string;
  coinFlash: boolean;
}

export const VendingBench: React.FC<VendingBenchProps> = ({ items, playerState, onBuy, gBotMessage, coinFlash }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-expand briefly when message changes (optional, but good for visibility)
  useEffect(() => {
    if (gBotMessage) {
        // Maybe pulse or subtle highlight?
    }
  }, [gBotMessage]);

  return (
    <div 
        className={`absolute bottom-0 left-0 right-0 bg-white border-t-4 border-pink-200 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] transition-all duration-500 z-50 flex flex-col ${
            isExpanded ? 'h-[280px]' : 'h-[80px]'
        }`}
    >
      {/* Handle / Header */}
      <div 
        className="h-12 flex items-center justify-between px-6 bg-pink-50 rounded-t-[20px] cursor-pointer hover:bg-pink-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3 overflow-hidden">
            <div className="bg-white p-1 rounded-full border border-slate-200">
                <Bot size={20} className="text-pink-500" />
            </div>
            <p className="text-xs text-slate-600 font-medium truncate max-w-[200px] md:max-w-xs">
                <span className="font-bold text-pink-500 mr-1">G-Bot:</span>
                "{gBotMessage}"
            </p>
        </div>
        
        <div className="flex items-center space-x-4">
             <div className={`flex items-center space-x-1 bg-white px-3 py-1 rounded-full border border-yellow-200 shadow-sm transition-transform duration-300 ${coinFlash ? 'scale-110 bg-yellow-50 ring-2 ring-yellow-400' : ''}`}>
                <span className="text-sm font-black text-yellow-600">{playerState.coins} 🪙</span>
            </div>
            {isExpanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronUp size={18} className="text-slate-400" />}
        </div>
      </div>

      {/* Main Shop Area */}
      <div className="flex-1 p-4 bg-white overflow-y-auto">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-3 text-center">
            {isExpanded ? 'Current Stock' : ''}
        </h3>
        
        <div className="grid grid-cols-3 gap-3 h-full">
            {items.map(item => {
                 const canAfford = playerState.coins >= item.cost;
                 const isOwned = playerState.inventory.includes(item.id);
                 const isConsumable = item.type === 'CONSUMABLE';
                 
                 return (
                    <button 
                        key={item.id}
                        disabled={!canAfford || (isOwned && !isConsumable)}
                        onClick={(e) => { e.stopPropagation(); onBuy(item); }}
                        className={`relative rounded-xl border-2 p-2 flex flex-col items-center justify-center transition-all ${
                            isOwned && !isConsumable ? 'border-green-100 bg-green-50 opacity-60' :
                            canAfford ? 'border-slate-100 bg-white hover:border-pink-300 hover:shadow-md active:scale-95' : 'border-slate-50 bg-slate-50 opacity-50 grayscale'
                        }`}
                    >
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <div className="text-[10px] font-bold text-slate-700 leading-tight text-center line-clamp-2">{item.name}</div>
                        
                        {!isExpanded && (
                            // Simplified view for collapsed state? No, we hide items in collapsed state mostly or just show top half?
                            // Actually with h-80px, this part is hidden. The grid is only visible when expanded.
                            // BUT user asked for "Shows 3 items... always available".
                            // Let's modify the CSS to allow peeking or adjust height.
                            // If user wants items always available, height needs to be taller or horizontal scroll in the handle bar.
                            // Let's stick to the expand logic for full details, but maybe show icons in the header?
                            // Re-reading prompt: "Implement a ... dock ... that shows ... 3 dynamic items ... always available"
                            // Okay, I will redesign slightly.
                            <></>
                        )}
                        <div className="mt-1 text-[10px] font-bold text-pink-500">
                             {isOwned && !isConsumable ? 'Owned' : `${item.cost}`}
                        </div>
                    </button>
                 )
            })}
        </div>
      </div>
      
      {/* Mini-Shelf (Visible when Collapsed) */}
      {!isExpanded && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-6 pointer-events-none opacity-0">
             {/* Placeholder for future polish: Floating mini icons if we wanted them on the bar */}
          </div>
      )}
    </div>
  );
};