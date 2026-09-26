import React, { useState } from 'react';
import { Bot, Sparkles, Send, ArrowRight, ShieldCheck, Zap, HelpCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

interface CenterAISectionProps {
  onOpenAI: (initialTopic?: string) => void;
  onOpenConsultation: () => void;
  onOpenQuote: () => void;
}

export const CenterAISection: React.FC<CenterAISectionProps> = ({
  onOpenAI,
  onOpenConsultation,
  onOpenQuote,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [quickPrompt, setQuickPrompt] = useState('');

  const sampleQuestions = [
    'Which Maxwell motor capacity for 14x10 ft shutter?',
    'Dewas GI Chaukhat vs Teak Wood frame comparison',
    'CNC laser-cut luxury main gate sheet gauge specs',
    'Estimated fabrication cost for PEB industrial warehouse shed',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickPrompt.trim()) {
      onOpenAI(quickPrompt.trim());
      setQuickPrompt('');
    } else {
      onOpenAI();
    }
  };

  return (
    <section id="ai-assistant-hub" className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background radial glow */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] blur-[120px] pointer-events-none rounded-full ${
          isLight ? 'bg-amber-300/20' : 'bg-amber-500/10'
        }`}
      />

      <div className="relative mx-auto max-w-5xl">
        <div
          className={`relative rounded-3xl p-8 sm:p-12 border shadow-2xl backdrop-blur-xl transition-all duration-300 overflow-hidden ${
            isLight
              ? 'bg-gradient-to-br from-amber-500/10 via-white to-amber-50/60 border-amber-200/80 shadow-amber-900/5'
              : 'bg-gradient-to-br from-slate-900/90 via-slate-950 to-amber-950/20 border-amber-500/30 shadow-black/80'
          }`}
        >
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Centered Content */}
          <div className="relative text-center max-w-3xl mx-auto space-y-6">
            {/* Centered Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-500 font-bold text-xs uppercase tracking-wider"
            >
              <Bot className="w-4 h-4 animate-bounce" />
              <span>Center Webpage AI Engineering Hub</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
            </motion.div>

            {/* Main Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight ${
                isLight ? 'text-slate-950' : 'text-white'
              }`}
            >
              Ask Lakhera AI:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600">
                Instant Technical Sizing & Advice
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className={`text-sm sm:text-base leading-relaxed ${
                isLight ? 'text-slate-700 font-normal' : 'text-slate-300 font-light'
              }`}
            >
              Have a project question? Ask our AI assistant for real-time motor wattage recommendations, Dewas GI frame gauge comparisons, CNC laser design feasibility, or schedule an on-site visit.
            </motion.p>

            {/* Quick Interactive Input Box in Center of Webpage */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="mt-6 flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto"
            >
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder="e.g. What motor do I need for a 16ft wide warehouse shutter?"
                  className={`w-full px-5 py-4 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-inner'
                      : 'bg-slate-900/90 border-slate-700 text-white placeholder:text-slate-500 shadow-inner'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all font-display whitespace-nowrap"
              >
                <span>Ask AI Now</span>
                <Send className="w-4 h-4" />
              </button>
            </motion.form>

            {/* Sample Suggested Prompts */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Frequently Asked Technical Topics:</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onOpenAI(q)}
                    className={`text-xs px-3.5 py-2 rounded-xl border transition-all cursor-pointer font-medium text-left ${
                      isLight
                        ? 'bg-white/80 hover:bg-amber-50 border-slate-200 hover:border-amber-300 text-slate-800 shadow-sm'
                        : 'bg-slate-900/70 hover:bg-slate-800 border-slate-800 hover:border-amber-500/40 text-slate-300'
                    }`}
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Footer Indicators */}
            <div className={`pt-6 border-t mt-8 flex flex-wrap items-center justify-center gap-6 text-xs ${
              isLight ? 'border-slate-200/80 text-slate-600' : 'border-slate-800 text-slate-400'
            }`}>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>IS 800 & IS 875 Engineering Standards</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Instant Offline & Cloud Dual-Engine</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Bhopal Workshop Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
