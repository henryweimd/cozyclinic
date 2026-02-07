import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-[100dvh] w-screen bg-pink-50 flex items-center justify-center p-0 md:p-4 overflow-hidden">
      <div className="w-full max-w-[430px] bg-white h-full md:h-[90vh] md:max-h-[850px] md:rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col border-0 md:border-[8px] border-white md:border-pink-200 ring-1 ring-black/5">
        {children}
      </div>
    </div>
  );
};