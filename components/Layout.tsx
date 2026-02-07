
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  isCozyMode?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, isCozyMode = true }) => {
  // Cozy Theme: Warm, pink/rose outer, soft rose border
  const cozyOuter = "bg-rose-100";
  const cozyBorder = "md:border-rose-200";

  // Pro Theme: Cool, clinical slate/blue outer, slate border
  const proOuter = "bg-slate-200";
  const proBorder = "md:border-slate-300";

  return (
    <div className={`h-[100dvh] w-screen ${isCozyMode ? cozyOuter : proOuter} transition-colors duration-700 ease-in-out flex items-center justify-center p-0 md:p-4 overflow-hidden`}>
      <div className={`w-full max-w-[430px] bg-white h-full md:h-[90vh] md:max-h-[850px] md:rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col border-0 md:border-[8px] border-white ${isCozyMode ? cozyBorder : proBorder} ring-1 ring-black/5 transition-all duration-700 ease-in-out`}>
        {children}
      </div>
    </div>
  );
};
