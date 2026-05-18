import { type ReactNode } from "react";

export const AuroraBackground = ({ children, theme = 'dark' }: { children: ReactNode, theme?: string }) => {
  return (
    <div className={`relative min-h-screen w-full transition-colors duration-500 flex flex-col items-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Background layer with overflow-hidden so the blurry circles don't create scrollbars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-green/20 blur-[120px] mix-blend-screen fixed" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-blue/20 blur-[120px] mix-blend-screen fixed" />
        <div className={`absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full blur-[100px] mix-blend-screen animate-pulse fixed transition-colors ${theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-500/20'}`} />
        <div className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay fixed transition-opacity ${theme === 'dark' ? 'opacity-20' : 'opacity-40'}`} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {children}
      </div>
    </div>
  );
};
