
import React, { useState } from 'react';
import { PatientCase, PlayerState } from '../types';
import { ArrowLeft, Search, Plus, Database, AlertCircle, Loader2, Home, Bot, ShoppingBag, TrendingUp, Cpu, Activity, Tag, Zap } from 'lucide-react';
import { VENDING_MACHINE_ITEMS } from '../constants';
import { getRecommendedItems } from '../utils';

interface TestingScreenProps {
  initialCases: PatientCase[];
  generatedCases: PatientCase[];
  playerState: PlayerState;
  onBackToStart: () => void;
  onBackToGame: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const TestingScreen: React.FC<TestingScreenProps> = ({
  initialCases,
  generatedCases,
  playerState,
  onBackToStart,
  onBackToGame,
  onGenerate,
  isGenerating
}) => {
  const [activeTab, setActiveTab] = useState<'cases' | 'economy'>('cases');
  const [searchTerm, setSearchTerm] = useState('');

  const allCases = [...generatedCases, ...initialCases];
  const filteredCases = allCases.filter(c =>
    c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.medicalTheme.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCaseLibrary = () => (
    <>
      <div className="p-4 space-y-4 shrink-0 bg-white border-b border-slate-100">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
                type="text"
                placeholder="Search cases..."
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

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 pt-3 bg-slate-50">
        <div className="flex justify-between items-center mb-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Library Stats
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
                {generatedCases.length} Gen / {initialCases.length} Static
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
                                        AI
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full uppercase font-bold mt-1 inline-block">
                                {c.medicalTheme}
                            </span>
                        </div>
                    </div>
                    <div className="text-[9px] font-mono text-slate-300">
                        {c.id.substring(0, 8)}
                    </div>
                </div>
                <p className="text-xs text-slate-600 italic mb-2 border-l-2 border-pink-100 pl-2 line-clamp-2">
                    "{c.chiefComplaint}"
                </p>
            </div>
        ))}
        
        {filteredCases.length === 0 && (
            <div className="text-center py-10 text-slate-400 flex flex-col items-center">
                <AlertCircle size={32} className="mb-2 opacity-50"/>
                <p>No cases found.</p>
            </div>
        )}
      </div>
    </>
  );

  const renderEconomyDashboard = () => {
    // Simulated Logic Analysis
    // Look at the next 3 cases to see what the bot "sees"
    const nextCases = allCases.slice(0, 3);
    const demandTags = new Set<string>();
    nextCases.forEach(c => {
        if (c.medicalTheme) demandTags.add(c.medicalTheme.toLowerCase());
        if (c.requiredToolId) demandTags.add("tool_demand");
    });
    
    // Run Recommendation Algorithm dry-run
    const recommended = getRecommendedItems(nextCases, playerState.inventory, VENDING_MACHINE_ITEMS);

    return (
      <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4">
        
        {/* Agent Status Card */}
        <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
                <Bot size={80} className="text-indigo-500" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-widest">G-Bot Agent Status</h3>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                        <span className="text-sm text-slate-500 flex items-center gap-2">
                            <Cpu size={14} /> AI Model
                        </span>
                        <span className="text-sm font-bold text-slate-800">Gemini 3.0 Flash</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                        <span className="text-sm text-slate-500 flex items-center gap-2">
                            <Activity size={14} /> Reasoning
                        </span>
                        <span className="text-sm font-bold text-emerald-600">Active (Lookahead)</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500 flex items-center gap-2">
                            <Zap size={14} /> Latency
                        </span>
                        <span className="text-sm font-bold text-slate-800">~240ms</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Predictive Logic Visualizer */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <TrendingUp size={14} /> Predictive Demand Analysis
            </h3>
            
            <div className="bg-slate-50 rounded-lg p-3 mb-3 border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Analyzing Next 3 Scenarios</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {nextCases.map((c, i) => (
                        <div key={i} className="bg-white px-2 py-1 rounded border border-slate-200 text-xs text-slate-600 whitespace-nowrap flex items-center gap-1 shadow-sm">
                            <span>{c.medicalTheme}</span>
                            {c.requiredToolId && <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {Array.from(demandTags).map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-[10px] bg-pink-50 text-pink-600 px-2 py-1 rounded-full font-bold border border-pink-100">
                        <Tag size={10} /> {tag.toUpperCase()}
                    </span>
                ))}
            </div>
        </div>

        {/* Current Machine State */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <ShoppingBag size={14} /> Machine Output (Current Stock)
            </h3>
            <div className="grid grid-cols-2 gap-3">
                {recommended.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-2 border border-slate-100 rounded-lg bg-slate-50/50">
                        <span className="text-xl">{item.icon}</span>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-700 truncate">{item.name}</p>
                            <p className="text-[10px] text-slate-500">{item.cost} Coins</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                 <span className="text-slate-400">Player Wallet</span>
                 <span className="font-bold text-yellow-600">{playerState.coins} Coins</span>
            </div>
        </div>

      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white p-3 shadow-sm border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shrink-0">
        <button 
            onClick={onBackToGame} 
            className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
            title="Back to Game"
        >
            <ArrowLeft size={20} />
        </button>
        <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Database size={18} className="text-pink-500"/>
            Developer Console
        </h2>
        <button 
            onClick={onBackToStart} 
            className="p-2 hover:bg-pink-50 rounded-full text-pink-500 transition-colors"
            title="Go to Home"
        >
            <Home size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white shrink-0">
        <button 
          onClick={() => setActiveTab('cases')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'cases' ? 'text-pink-600 border-b-2 border-pink-500 bg-pink-50/30' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Case Library
        </button>
        <button 
          onClick={() => setActiveTab('economy')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'economy' ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/30' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Vending Econ
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
         {activeTab === 'cases' ? renderCaseLibrary() : renderEconomyDashboard()}
      </div>
    </div>
  );
};
