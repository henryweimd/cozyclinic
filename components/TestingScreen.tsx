
import React, { useState } from 'react';
import { PatientCase } from '../types';
import { ArrowLeft, Search, Plus, Database, AlertCircle, Loader2, Home } from 'lucide-react';

interface TestingScreenProps {
  initialCases: PatientCase[];
  generatedCases: PatientCase[];
  onBackToStart: () => void;
  onBackToGame: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const TestingScreen: React.FC<TestingScreenProps> = ({
  initialCases,
  generatedCases,
  onBackToStart,
  onBackToGame,
  onGenerate,
  isGenerating
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const allCases = [...generatedCases, ...initialCases]; // Show newest (generated) first
  const filteredCases = allCases.filter(c =>
    c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.medicalTheme.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shrink-0">
        <button 
            onClick={onBackToGame} 
            className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
            title="Back to Game"
        >
            <ArrowLeft size={20} />
        </button>
        <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Database size={18} className="text-pink-500"/>
            Case Library
        </h2>
        <button 
            onClick={onBackToStart} 
            className="p-2 hover:bg-pink-50 rounded-full text-pink-500 transition-colors"
            title="Go to Landing Page"
        >
            <Home size={20} />
        </button>
      </div>

      {/* Controls */}
      <div className="p-4 space-y-4 shrink-0">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
                type="text"
                placeholder="Search by name, theme, or symptom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm transition-all"
            />
        </div>

        <button
            onClick={onGenerate}
            disabled={isGenerating}
            className={`w-full py-3 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all ${
                isGenerating
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-[1.02] active:scale-95'
            }`}
        >
            {isGenerating ? (
                <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating (Max 10s)...
                </>
            ) : (
                <>
                    <Plus size={18} />
                    Generate New Case (Gemini 3)
                </>
            )}
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Scenarios: {filteredCases.length}
            </h3>
            <span className="text-[10px] text-slate-400">
                {generatedCases.length} Custom / {initialCases.length} Base
            </span>
        </div>

        {filteredCases.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-pink-200 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform">{c.patientVisual.split(' ')[0]}</span>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-800 text-sm">{c.patientName}</h4>
                                {c.id.startsWith('gen_') && (
                                    <span className="text-[9px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full uppercase font-bold border border-purple-200">
                                        Custom
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full uppercase font-bold mt-1 inline-block">
                                {c.medicalTheme}
                            </span>
                        </div>
                    </div>
                    <div className="text-[9px] font-mono text-slate-300">
                        {c.id.substring(0, 8)}...
                    </div>
                </div>
                <p className="text-xs text-slate-600 italic mb-2 border-l-2 border-pink-100 pl-2">
                    "{c.chiefComplaint}"
                </p>
                <div className="flex gap-2">
                    <div className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded">
                        Age: {c.patientAge}
                    </div>
                    {c.variants && (
                        <div className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-medium">
                            Variants: Ready
                        </div>
                    )}
                </div>
            </div>
        ))}
        
        {filteredCases.length === 0 && (
            <div className="text-center py-10 text-slate-400 flex flex-col items-center">
                <AlertCircle size={32} className="mb-2 opacity-50"/>
                <p>No cases found matching your search.</p>
            </div>
        )}
      </div>
    </div>
  );
};
