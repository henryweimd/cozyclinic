
import React, { useState } from 'react';
import { PatientCase, Choice, Item } from '../types';
import { parseMedicalText } from '../utils';
import { Activity, FileText, AlertCircle, Sparkles, Beaker, User, Image as ImageIcon, Heart, Lock, Unlock, Search, CheckCircle } from 'lucide-react';
import { VENDING_MACHINE_ITEMS } from '../constants';

interface PatientCardProps {
  patientCase: PatientCase;
  onMakeChoice: (choice: Choice) => void;
  isLoading: boolean;
  isCozyMode: boolean;
  inventory: string[];
  onSolveWithItem?: () => void; // New callback for Optimized Path
}

export const PatientCard: React.FC<PatientCardProps> = ({ 
  patientCase, 
  onMakeChoice, 
  isLoading, 
  isCozyMode,
  inventory,
  onSolveWithItem
}) => {
  const [isClueRevealed, setIsClueRevealed] = useState(false);

  if (isLoading) {
      return (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-8 animate-pulse">
              <div className="w-24 h-24 bg-pink-200 rounded-full"></div>
              <div className="h-4 bg-pink-100 w-3/4 rounded"></div>
              <div className="h-4 bg-pink-100 w-1/2 rounded"></div>
          </div>
      )
  }

  // Determine which text to show based on mode
  const activeVariant = isCozyMode && patientCase.variants ? patientCase.variants.cozy : (patientCase.variants?.regular || patientCase);
  
  // Need to handle fallback if standard fields are used in 'activeVariant' (which maps to PatientCase)
  const cc = 'chiefComplaint' in activeVariant ? activeVariant.chiefComplaint : patientCase.chiefComplaint;
  const hpi = 'hpi' in activeVariant ? activeVariant.hpi : patientCase.hpi;
  const exam = 'physicalExam' in activeVariant ? activeVariant.physicalExam : patientCase.physicalExam;
  const choices = 'choices' in activeVariant ? activeVariant.choices : patientCase.choices;

  // Tool Logic
  const requiredToolId = patientCase.requiredToolId;
  const hasTool = requiredToolId ? inventory.includes(requiredToolId) : false;
  const requiredItemDetails = requiredToolId ? VENDING_MACHINE_ITEMS.find(i => i.id === requiredToolId) : null;
  const isOptimizedPath = !!patientCase.optimizedResolution;

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-4 pb-48 scroll-smooth">
      {/* Condensed Header */}
      <div className={`rounded-xl p-3 border shadow-sm flex items-center space-x-4 relative overflow-hidden transition-colors duration-500 ${isCozyMode ? 'bg-pink-50 border-pink-200' : 'bg-white border-indigo-100'}`}>
         <div className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l to-transparent ${isCozyMode ? 'from-pink-100' : 'from-indigo-50'}`}></div>
         <div className="text-4xl shrink-0 z-10">
            {patientCase.patientVisual.split(' ')[0] || '😷'}
         </div>
         <div className="flex-1 min-w-0 z-10">
             <div className="flex items-center space-x-2">
                 <h2 className="text-xl font-bold text-slate-800 truncate">{patientCase.patientName}</h2>
                 <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isCozyMode ? 'bg-pink-200 text-pink-600' : 'bg-indigo-100 text-indigo-500'}`}>
                    {patientCase.medicalTheme}
                 </span>
             </div>
             <p className="text-slate-500 text-sm truncate">
                {patientCase.patientAge} • {patientCase.patientVisual.replace(/^[^\s]+\s/, '')}
             </p>
         </div>
         {isCozyMode && <Heart className="text-pink-400 absolute top-2 right-2 animate-pulse" size={12} fill="currentColor" />}
      </div>

      {/* Clinical Data Stack - Condensed */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-50">
        
        {/* CC & Vitals Row */}
        <div className="p-4 space-y-3">
             <div className="flex items-start space-x-2">
                <AlertCircle className="text-red-400 mt-1 shrink-0" size={18} />
                <div className="leading-tight">
                    <span className="text-xs font-bold text-slate-400 uppercase mr-2">CC:</span>
                    <span className={`text-slate-800 font-bold italic text-base ${isCozyMode ? 'font-comic' : ''}`}>"{cc.replace(/"/g, '')}"</span>
                </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg overflow-x-auto">
                 <Activity className="text-emerald-500 shrink-0" size={18} />
                 <div className="flex space-x-4 text-sm whitespace-nowrap">
                    <span className="font-mono text-slate-600"><b>HR:</b> {patientCase.vitals.hr}</span>
                    <span className="font-mono text-slate-600"><b>BP:</b> {patientCase.vitals.bp}</span>
                    <span className="font-mono text-slate-600"><b>T:</b> {patientCase.vitals.temp}</span>
                    <span className="font-mono text-slate-600"><b>RR:</b> {patientCase.vitals.rr}</span>
                    <span className="font-mono text-slate-600"><b>O2:</b> {patientCase.vitals.o2}</span>
                 </div>
            </div>
        </div>

        {/* HPI */}
        <div className="p-4 flex items-start space-x-2">
            <FileText className="text-blue-400 mt-1 shrink-0" size={18} />
            <div className="text-sm text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-400 uppercase mr-1">HPI:</span>
                {hpi}
            </div>
        </div>

        {/* Labs (Conditional) */}
        {patientCase.labs && patientCase.labs.length > 0 && (
            <div className="p-4 flex items-start space-x-2 bg-yellow-50/50">
                <Beaker className="text-yellow-500 mt-1 shrink-0" size={18} />
                <div className="text-sm">
                     <span className="font-bold text-yellow-600 uppercase mr-1">Labs:</span>
                     <div className="flex flex-wrap gap-2 mt-1">
                        {patientCase.labs.map((lab, i) => (
                            <span key={i} className="bg-white border border-yellow-200 text-slate-700 px-2 py-1 rounded shadow-sm font-mono text-xs">
                                {lab}
                            </span>
                        ))}
                     </div>
                </div>
            </div>
        )}

        {/* Physical Exam */}
        <div className="p-4 flex items-start space-x-2">
            <User className="text-purple-400 mt-1 shrink-0" size={18} />
            <div className="text-sm text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-400 uppercase mr-1">Exam:</span>
                {parseMedicalText(exam)}
            </div>
        </div>
        
        {/* Advanced Tool Analysis / Optimized Path Section */}
        {requiredToolId && (
           <div className={`p-4 transition-colors border-t border-slate-100 ${isClueRevealed ? 'bg-indigo-50' : 'bg-slate-50'}`}>
              {!isClueRevealed ? (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${hasTool ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
                            {hasTool ? <Unlock size={18} /> : <Lock size={18} />}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                {isOptimizedPath ? "Item Resolution Available" : "Advanced Diagnostics"}
                            </p>
                            <p className="text-sm font-semibold text-slate-800">
                                {hasTool 
                                    ? `Use ${requiredItemDetails?.name} to ${isOptimizedPath ? 'Treat' : 'Examine'}` 
                                    : `Requires: ${requiredItemDetails?.name}`
                                }
                            </p>
                        </div>
                    </div>
                    {hasTool && (
                        <button 
                            onClick={() => {
                                if (isOptimizedPath && onSolveWithItem) {
                                    onSolveWithItem();
                                } else {
                                    setIsClueRevealed(true);
                                }
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-bold active:scale-95 transition-all shadow-md flex items-center gap-2 ${
                                isOptimizedPath 
                                ? 'bg-green-500 text-white hover:bg-green-600 shadow-green-200' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                            }`}
                        >
                            {isOptimizedPath ? <CheckCircle size={14} /> : <Search size={14} />}
                            {isOptimizedPath ? "Use Item" : "Examine"}
                        </button>
                    )}
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                     <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={14} className="text-indigo-500" />
                        <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Diagnostic Clue Revealed</span>
                     </div>
                     <p className="text-sm font-medium text-slate-800 italic border-l-4 border-indigo-300 pl-3 py-1">
                        "{patientCase.revealedClue}"
                     </p>
                </div>
              )}
           </div>
        )}

      </div>

      {/* AI Generated Image */}
      {patientCase.imageUrl ? (
          <div className="w-full aspect-[21/9] rounded-xl overflow-hidden shadow-sm border border-slate-200 relative group">
              <img 
                src={patientCase.imageUrl} 
                alt="Medical Illustration" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                <Sparkles size={10} /> AI Generated
              </div>
          </div>
      ) : patientCase.imagePrompt ? (
          <div className="w-full aspect-[21/9] rounded-xl bg-slate-100 flex items-center justify-center border border-dashed border-slate-300">
             <div className="flex flex-col items-center text-slate-400 animate-pulse">
                <ImageIcon size={24} />
                <span className="text-xs mt-2 font-medium">Generating visualization...</span>
             </div>
          </div>
      ) : null}

      {/* Orders */}
      <div className="pt-2">
        <h3 className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Select Order {isCozyMode ? '(Cozy Mode)' : ''}</h3>
        <div className="grid grid-cols-1 gap-3">
            {choices.map((choice) => (
                <button
                    key={choice.id}
                    onClick={() => onMakeChoice(choice)}
                    className={`w-full bg-white border hover:bg-pink-50 text-slate-700 hover:text-pink-700 p-4 rounded-xl text-left transition-all duration-200 shadow-sm text-sm font-semibold active:scale-[0.99] ${isCozyMode ? 'border-pink-200' : 'border-slate-200 hover:border-pink-300'}`}
                >
                    {choice.text}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};
