import React, { useState } from 'react';
import { Phone, MessageSquare, Menu, X, Calendar, FileText, Sun, Moon } from 'lucide-react';
import { WORKSHOP_INFO } from '../data/servicesData';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenConsultation: () => void;
  onOpenQuote: () => void;
  onOpenAI: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenConsultation,
  onOpenQuote,
  onOpenAI,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        isLight
          ? 'bg-white/95 border-b border-slate-200/80 text-slate-900 shadow-sm'
          : 'bg-slate-950/90 border-b border-slate-800/80 text-white'
      } backdrop-blur-md`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className={`text-xl font-bold tracking-tight transition-colors font-display ${
            isLight ? 'text-slate-950 hover:text-amber-600' : 'text-white hover:text-amber-400'
          }`}
        >
          Lakhera Enterprise
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav
          className={`hidden md:flex items-center gap-8 text-sm font-medium ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}
        >
          <a
            href="#services"
            className={`transition-colors ${isLight ? 'hover:text-amber-600' : 'hover:text-amber-400'}`}
          >
            Services
          </a>
          <a
            href="#automation"
            className={`transition-colors ${isLight ? 'hover:text-amber-600' : 'hover:text-amber-400'}`}
          >
            Maxwell Automation
          </a>
          <a
            href="#consultation"
            className={`transition-colors ${isLight ? 'hover:text-amber-600' : 'hover:text-amber-400'}`}
          >
            Consultation
          </a>
          <a
            href="#workshop-location"
            className={`transition-colors ${isLight ? 'hover:text-amber-600' : 'hover:text-amber-400'}`}
          >
            Workshop & Location
          </a>
          <button
            onClick={onOpenAI}
            className={`transition-colors flex items-center gap-1.5 font-semibold cursor-pointer ${
              isLight ? 'text-amber-600 hover:text-amber-700' : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Ask Lakhera AI
          </button>
        </nav>

        {/* Zone 3: Actions + Theme Toggle */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center justify-center ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-amber-400'
            }`}
            title={isLight ? 'Switch to Dark Onyx Theme' : 'Switch to Bright White Theme'}
            aria-label="Toggle Bright White or Dark Theme"
          >
            {isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          <a
            href={WORKSHOP_INFO.whatsappBase}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-colors border ${
              isLight
                ? 'text-emerald-700 bg-emerald-50 border-emerald-300 hover:bg-emerald-100'
                : 'text-emerald-400 bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60'
            }`}
            title="Chat on WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">WhatsApp</span>
          </a>

          <button
            onClick={onOpenConsultation}
            className={`px-3.5 py-2 text-xs font-medium rounded-xl border transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              isLight
                ? 'text-slate-800 bg-white border-slate-300 hover:border-amber-500 hover:text-amber-600 shadow-sm'
                : 'text-slate-200 bg-slate-900 border-slate-700 hover:border-amber-400/50 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            Book Consultation
          </button>

          <button
            onClick={onOpenQuote}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            Get a Quote
          </button>
        </div>

        {/* Mobile Hamburger & Theme Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-lg border text-xs ${
              isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-900 border-slate-700 text-amber-400'
            }`}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenQuote}
            className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 rounded-lg"
          >
            Quote
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 transition-colors ${isLight ? 'text-slate-800 hover:text-black' : 'text-slate-300 hover:text-white'}`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className={`sm:hidden border-t px-4 py-6 space-y-4 ${
            isLight ? 'bg-white border-slate-200 text-slate-800 shadow-xl' : 'bg-slate-950 border-slate-800 text-white'
          }`}
        >
          <nav className="flex flex-col space-y-3 text-base font-medium">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-amber-600"
            >
              Services Portfolio
            </a>
            <a
              href="#automation"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-amber-600"
            >
              Automatic Maxwell Motors
            </a>
            <a
              href="#consultation"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-amber-600"
            >
              Book Consultation
            </a>
            <a
              href="#workshop-location"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-amber-600"
            >
              Workshop Location & Map
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAI();
              }}
              className="py-1 text-left text-amber-600 font-semibold flex items-center gap-2"
            >
              Ask Lakhera AI Assistant
            </button>
          </nav>

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full py-2.5 px-4 text-center text-sm font-semibold text-slate-900 border border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-xl"
            >
              Book Free Site/Online Consultation
            </button>
            <a
              href={`tel:${WORKSHOP_INFO.phoneRaw}`}
              className="w-full py-2.5 px-4 text-center text-sm font-medium text-slate-800 border border-slate-300 rounded-xl flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-amber-500" />
              Call Workshop: +91 82230 01415
            </a>
            <a
              href={WORKSHOP_INFO.whatsappBase}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 text-center text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
