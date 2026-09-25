import React from 'react';
import { Phone, MessageSquare, FileText, Bot } from 'lucide-react';
import { WORKSHOP_INFO } from '../data/servicesData';
import { useTheme } from '../context/ThemeContext';

interface MobileActionDockProps {
  onOpenQuote: () => void;
  onOpenConsultation: () => void;
  onOpenAI: () => void;
}

export const MobileActionDock: React.FC<MobileActionDockProps> = ({
  onOpenQuote,
  onOpenConsultation,
  onOpenAI,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <>
      {/* Floating Ask Lakhera AI Bubble (desktop & mobile) */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={onOpenAI}
          className="group relative flex items-center gap-2.5 px-4.5 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs rounded-full shadow-2xl shadow-amber-500/30 transition-all duration-200 cursor-pointer"
          aria-label="Open Ask Lakhera AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-slate-950" />
            <span className="animate-ping absolute -top-1 -right-1 w-2 h-2 rounded-full bg-slate-950 opacity-75" />
          </div>
          <span className="font-display font-extrabold tracking-wide">Ask Lakhera AI</span>
        </button>
      </div>

      {/* Mobile Bottom Dock (<= 15% viewport height rule) */}
      <div
        className={`sm:hidden fixed bottom-0 inset-x-0 z-40 p-2.5 flex items-center justify-between gap-2 h-14 border-t backdrop-blur-md transition-colors ${
          isLight
            ? 'bg-white/95 border-slate-200 shadow-xl'
            : 'bg-slate-950/95 border-slate-800'
        }`}
      >
        <a
          href={`tel:${WORKSHOP_INFO.phoneRaw}`}
          className={`flex-1 h-full text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 border transition-colors ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
          }`}
        >
          <Phone className="w-3.5 h-3.5 text-amber-500" />
          <span>Call</span>
        </a>

        <a
          href={WORKSHOP_INFO.whatsappBase}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 h-full text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 border transition-colors ${
            isLight
              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
              : 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400 border-emerald-500/30'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>

        <button
          onClick={onOpenQuote}
          className="flex-1 h-full bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 text-slate-950 text-[11px] font-extrabold rounded-xl flex items-center justify-center gap-1 shadow-md cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Quote</span>
        </button>
      </div>
    </>
  );
};
