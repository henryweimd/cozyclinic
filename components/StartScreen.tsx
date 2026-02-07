import React from 'react';
import { Play, Stethoscope, Sparkles } from 'lucide-react';

interface StartScreenProps {
  onStart: (mode: 'normal' | 'demo') => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-pink-50 to-white text-center space-y-8">
      <div className="relative">
        <div className="absolute -inset-4 bg-pink-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <div className="bg-white p-6 rounded-3xl shadow-xl relative transform -rotate-3 border-4 border-pink-100">
            <Stethoscope size={64} className="text-pink-500" />
        </div>
      </div>
      
      <div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Cozy Clinic</h1>
        <p className="text-slate-500 font-medium px-4 leading-relaxed">
          Learn real Medicine. Collect coins and upgrade your clinic. Have fun!
        </p>
      </div>

      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <button 
            onClick={() => onStart('normal')}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-pink-500 font-lg rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 hover:bg-pink-600 hover:scale-105 shadow-lg shadow-pink-200 w-full"
        >
            <span>Start Seeing Patients</span>
            <Play className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" />
        </button>

        <button 
            onClick={() => onStart('demo')}
            className="flex items-center justify-center space-x-2 px-6 py-3 font-bold text-purple-600 transition-all duration-200 bg-purple-50 rounded-full border border-purple-100 hover:bg-purple-100 hover:scale-105 w-full"
        >
            <Sparkles size={16} />
            <span>Demo Mode (Unlocks All)</span>
        </button>
      </div>

      <p className="text-xs text-slate-400 mt-8 absolute bottom-8">Powered by Gemini 3.0</p>
    </div>
  );
};