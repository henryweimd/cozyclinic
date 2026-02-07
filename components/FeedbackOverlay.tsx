
import React, { useEffect, useState } from 'react';
import { Choice, OutcomeType, PatientCase, Item } from '../types';
import { ArrowRight, CheckCircle, AlertTriangle, ShieldAlert, ExternalLink, Pause, Play, Sparkles, BookOpen } from 'lucide-react';

interface FeedbackOverlayProps {
  choice: Choice;
  patientCase: PatientCase;
  onNext: () => void;
  isLoadingNext: boolean;
  suggestedItem?: Item | null;
  onBuyItem?: (item: Item) => void;
  playerCoins: number;
  isCozyMode: boolean;
}

const getOutcomeConfig = (type: OutcomeType) => {
  switch (type) {
    case 'GOLD':
      return { 
        bg: 'bg-emerald-500', 
        buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
        icon: <CheckCircle size={48} className="text-emerald-100" />,
        title: 'Excellent!',
        sub: 'Gold Standard Care'
      };
    case 'ACCEPTABLE':
      return { 
        bg: 'bg-blue-500', 
        buttonBg: 'bg-blue-600 hover:bg-blue-700',
        icon: <CheckCircle size={48} className="text-blue-100" />,
        title: 'Good Job',
        sub: 'Acceptable Standard'
      };
    case 'SUBOPTIMAL':
      return { 
        bg: 'bg-amber-500', 
        buttonBg: 'bg-amber-600 hover:bg-amber-700',
        icon: <AlertTriangle size={48} className="text-amber-100" />,
        title: 'Not Quite',
        sub: 'Sub-optimal Approach'
      };
    case 'DANGEROUS':
      return { 
        bg: 'bg-red-500', 
        buttonBg: 'bg-red-600 hover:bg-red-700',
        icon: <ShieldAlert size={48} className="text-red-100" />,
        title: 'Careful!',
        sub: 'Dangerous Choice'
      };
  }
};

const getSourceName = (url: string) => {
    try {
        const hostname = new URL(url).hostname;
        if (hostname.includes('cdc.gov')) return 'Centers for Disease Control (CDC)';
        if (hostname.includes('mayoclinic.org')) return 'Mayo Clinic';
        if (hostname.includes('nih.gov')) return 'National Institutes of Health (NIH)';
        if (hostname.includes('statpearls')) return 'StatPearls (NCBI)';
        if (hostname.includes('aaos.org')) return 'American Academy of Orthopaedic Surgeons';
        if (hostname.includes('aaaai.org')) return 'AAAAI';
        if (hostname.includes('gi.org')) return 'American College of Gastroenterology';
        if (hostname.includes('migraine')) return 'American Migraine Foundation';
        return hostname.replace('www.', '');
    } catch {
        return 'Medical Source';
    }
};

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ 
  choice, 
  patientCase, 
  onNext, 
  isLoadingNext, 
  suggestedItem, 
  onBuyItem, 
  playerCoins,
  isCozyMode
}) => {
  const config = getOutcomeConfig(choice.type);
  const AUTO_ADVANCE_TIME = 15;
  const [timeLeft, setTimeLeft] = useState(AUTO_ADVANCE_TIME);
  const [isPaused, setIsPaused] = useState(false);

  // Determine the correct set of choices based on mode
  const activeVariant = isCozyMode && patientCase.variants ? patientCase.variants.cozy : (patientCase.variants?.regular || patientCase);
  const allChoices = 'choices' in activeVariant ? activeVariant.choices : patientCase.choices;
  
  // Find the GOLD standard answer
  const bestChoice = allChoices.find(c => c.type === 'GOLD');

  useEffect(() => {
    if (isLoadingNext) return;
    
    if (timeLeft <= 0 && !isPaused) {
        onNext();
        return;
    }

    if (!isPaused) {
        const timer = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 0.1));
        }, 100);
        return () => clearInterval(timer);
    }
  }, [timeLeft, isPaused, onNext, isLoadingNext]);

  const progressPercent = (timeLeft / AUTO_ADVANCE_TIME) * 100;

  return (
    <div 
        className="absolute inset-0 z-40 flex flex-col bg-white animate-in fade-in duration-300"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header Banner */}
      <div className={`${config.bg} p-6 flex flex-col items-center justify-center text-white shadow-lg shrink-0`}>
        <div className="mb-2 transform scale-110">
            {config.icon}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{config.title}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col overflow-y-auto space-y-4">
        
        {/* Feedback Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative">
            <div className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] font-bold uppercase text-slate-400 border border-slate-100 rounded-full">
                Mentor Feedback
            </div>
            <p className="text-slate-700 text-sm leading-relaxed font-medium mt-1">"{choice.feedback}"</p>
        </div>

        {/* Correction Block - Only show if the user didn't pick Gold and a Gold option exists */}
        {choice.type !== 'GOLD' && bestChoice && (
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 relative animate-in slide-in-from-bottom-2 fade-in duration-500 delay-100">
                <div className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] font-bold uppercase text-emerald-500 border border-emerald-100 rounded-full flex items-center gap-1">
                    <Sparkles size={10} /> Best Approach
                </div>
                <div className="mt-1">
                    <p className="text-xs font-bold text-emerald-700 mb-1">{bestChoice.text}</p>
                    <p className="text-emerald-600 text-xs leading-relaxed opacity-90">"{bestChoice.feedback}"</p>
                </div>
            </div>
        )}

        {/* Rewards */}
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-xl text-center">
                <span className="block text-yellow-600 text-[10px] font-bold uppercase">Reward</span>
                <span className="text-xl font-bold text-yellow-700">+{choice.coinReward} 🪙</span>
            </div>
             <div className="bg-purple-50 border border-purple-100 p-3 rounded-xl text-center">
                <span className="block text-purple-600 text-[10px] font-bold uppercase">XP</span>
                <span className="text-xl font-bold text-purple-700">+{choice.xpReward} XP</span>
            </div>
        </div>
        
        {/* Suggestion - Only show if we have one and user can afford it */}
        {suggestedItem && playerCoins >= suggestedItem.cost && (
             <div className="bg-pink-50 border border-pink-100 p-3 rounded-xl flex items-center space-x-3 shadow-sm animate-pulse">
                <div className="text-2xl bg-white p-2 rounded-full shadow-sm">{suggestedItem.icon}</div>
                <div className="flex-1">
                    <h4 className="text-[10px] font-bold text-pink-500 uppercase">Recommended</h4>
                    <p className="text-xs font-bold text-slate-700">{suggestedItem.name}</p>
                    <p className="text-[10px] text-slate-500">{suggestedItem.description}</p>
                </div>
                <button 
                    onClick={() => {
                        onBuyItem && onBuyItem(suggestedItem);
                        setIsPaused(true); // Keep paused so they see they bought it
                    }}
                    className="bg-pink-500 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-pink-600 active:scale-95 transition-all"
                >
                    Buy {suggestedItem.cost}🪙
                </button>
             </div>
        )}

        {/* Link - Enhanced Section */}
        {patientCase.authoritativeLink && (
            <div className="mt-2">
                <div className="flex items-center justify-between mb-1 px-1">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <BookOpen size={10} />
                        Learn More
                     </span>
                </div>
                <a 
                    href={patientCase.authoritativeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group relative overflow-hidden"
                    onClick={() => setIsPaused(true)}
                >
                    <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                         <ExternalLink size={64} className="text-indigo-500" />
                    </div>
                    
                    <div className="bg-indigo-50 p-2 rounded-lg mr-3 text-indigo-600 shrink-0 group-hover:scale-110 transition-transform z-10">
                        <ExternalLink size={18} />
                    </div>
                    
                    <div className="flex-1 min-w-0 z-10">
                        <h4 className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                            {getSourceName(patientCase.authoritativeLink)}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                             {patientCase.learningTidbit || (isCozyMode 
                                ? `See how real doctors treat ${patientCase.medicalTheme}!`
                                : `Review authoritative guidelines and clinical protocols for ${patientCase.medicalTheme}.`)
                            }
                        </p>
                    </div>
                </a>
            </div>
        )}
      </div>

      {/* Footer / Next Action */}
      <div className="p-5 bg-white border-t border-slate-100 shrink-0">
        <div className="flex justify-between items-center mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Next Patient</span>
            <span className="flex items-center gap-1">
                {isPaused ? <Pause size={10} /> : <Play size={10} />}
                {isPaused ? "Paused" : `Auto-advance in ${Math.ceil(timeLeft)}s`}
            </span>
        </div>
        
        <button 
            onClick={onNext}
            disabled={isLoadingNext}
            className={`w-full ${config.buttonBg} text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-wait relative overflow-hidden`}
        >
            {!isLoadingNext && !isPaused && (
                <div 
                    className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-100 ease-linear"
                    style={{ width: `${progressPercent}%` }}
                />
            )}
            
            <div className="relative z-10 flex items-center space-x-2">
                {isLoadingNext ? (
                    <span>Prepping Room...</span>
                ) : (
                    <>
                        <span>Continue</span>
                        <ArrowRight size={20} />
                    </>
                )}
            </div>
        </button>
      </div>
    </div>
  );
};
