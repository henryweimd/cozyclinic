
import React from 'react';
import { Item, PlayerState } from '../types';
import { ShoppingBag, X, Wrench } from 'lucide-react';

interface VendingMachineProps {
  items: Item[];
  playerState: PlayerState;
  onBuy: (item: Item) => void;
  onClose: () => void;
  onOpenTesting: () => void;
}

export const VendingMachine: React.FC<VendingMachineProps> = ({ 
  items, 
  playerState, 
  onBuy, 
  onClose,
  onOpenTesting
}) => {
  return (
    <div className="absolute inset-0 bg-pink-50 z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="bg-white p-4 shadow-sm flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-2">
            <ShoppingBag className="text-pink-500" />
            <h2 className="text-xl font-bold text-slate-800">Cozy Vending</h2>
        </div>
        <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
            <X size={20} className="text-slate-600" />
        </button>
      </div>

      <div className="bg-pink-100 py-3 px-4 flex justify-between items-center shadow-inner shrink-0">
          <span className="text-pink-800 font-bold text-sm">Your Wallet:</span>
          <span className="text-xl font-bold text-yellow-600 bg-white px-3 py-1 rounded-lg shadow-sm border border-yellow-100">
              {playerState.coins} 🪙
          </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4 content-start">
        {items.map(item => {
            const canAfford = playerState.coins >= item.cost;
            const isOwned = playerState.inventory.includes(item.id);
            const isConsumable = item.type === 'CONSUMABLE';

            return (
                <div key={item.id} className={`bg-white rounded-2xl p-4 flex flex-col items-center text-center shadow-md border-2 transition-all ${canAfford ? 'border-white' : 'border-slate-100 opacity-70'}`}>
                    <div className="text-4xl mb-2 bg-pink-50 w-16 h-16 flex items-center justify-center rounded-full">
                        {item.icon}
                    </div>
                    <h3 className="font-bold text-slate-800 text-base mb-1">{item.name}</h3>
                    <p className="text-sm text-slate-500 mb-4 h-14 overflow-hidden line-clamp-2 leading-tight">{item.description}</p>
                    
                    <button 
                        disabled={!canAfford || (isOwned && !isConsumable)}
                        onClick={() => onBuy(item)}
                        className={`w-full py-2 rounded-xl text-sm font-bold transition-colors ${
                            isOwned && !isConsumable
                                ? 'bg-green-100 text-green-600 cursor-default'
                                : canAfford 
                                    ? 'bg-pink-500 text-white hover:bg-pink-600 shadow-lg shadow-pink-200' 
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        {isOwned && !isConsumable ? 'Owned' : `${item.cost} 🪙`}
                    </button>
                </div>
            );
        })}
      </div>
      
      <div className="shrink-0 bg-white border-t border-slate-100">
        <div className="p-4 text-center text-sm text-slate-400 border-b border-slate-50">
            New items arrive every shift!
        </div>
        
        {/* Testing Link */}
        <button 
            onClick={onOpenTesting}
            className="w-full p-4 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-center space-x-2 text-slate-500 hover:text-pink-500 group"
        >
            <Wrench size={14} className="group-hover:rotate-45 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider">Open Developer Testing</span>
        </button>
      </div>
    </div>
  );
};
