import React from 'react';
import { WORKSHOP_INFO, SERVICES } from '../data/servicesData';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  onOpenConsultation: () => void;
  onOpenQuote: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenConsultation,
  onOpenQuote,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <footer
      className={`border-t transition-colors duration-200 text-xs ${
        isLight
          ? 'bg-slate-100 border-slate-200 text-slate-600'
          : 'bg-slate-950 border-slate-900 text-slate-400'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Wordmark & Company Intro */}
          <div className="space-y-4">
            <span className={`text-lg font-extrabold font-display ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}>
              Lakhera Enterprise
            </span>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Engineering, fabrication, and automation specialist based in Bhopal, MP. Leading manufacturer of motorized rolling shutters with Maxwell motors, CNC fiber laser-cut gates, Dewas GI door frames, and PEB industrial sheds.
            </p>
            <div className={`pt-2 text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
              Workshop in Bagsewaniya, Bhopal · Serving Pan-Madhya Pradesh
            </div>
          </div>

          {/* Col 2: Services Directory */}
          <div className="space-y-3">
            <div className={`font-bold text-xs uppercase tracking-wider ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Core Capabilities
            </div>
            <ul className="space-y-2 text-xs">
              {SERVICES.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <a
                    href="#services"
                    className={`transition-colors ${isLight ? 'hover:text-amber-700' : 'hover:text-amber-400'}`}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: More Services & Actions */}
          <div className="space-y-3">
            <div className={`font-bold text-xs uppercase tracking-wider ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              More Services & Actions
            </div>
            <ul className="space-y-2 text-xs">
              {SERVICES.slice(5).map((s) => (
                <li key={s.id}>
                  <a
                    href="#services"
                    className={`transition-colors ${isLight ? 'hover:text-amber-700' : 'hover:text-amber-400'}`}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <button
                  onClick={onOpenConsultation}
                  className={`font-semibold cursor-pointer transition-colors ${
                    isLight ? 'text-amber-700 hover:text-amber-900' : 'text-amber-400 hover:text-amber-300'
                  }`}
                >
                  Book On-Site Consultation
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenQuote}
                  className={`font-semibold cursor-pointer transition-colors ${
                    isLight ? 'text-amber-700 hover:text-amber-900' : 'text-amber-400 hover:text-amber-300'
                  }`}
                >
                  Get an Itemized Quote
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contact Info */}
          <div className="space-y-3">
            <div className={`font-bold text-xs uppercase tracking-wider ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Workshop & Office
            </div>
            <div className={`space-y-2.5 text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-tight">
                  Shop No. 15, Main Road, Near Raja Bhoj Arcade, Bagsewaniya, Bhopal, MP - 462043
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a
                  href={`tel:${WORKSHOP_INFO.phoneRaw}`}
                  className={`font-mono tabular-nums font-bold transition-colors ${
                    isLight ? 'text-slate-900 hover:text-amber-700' : 'text-white hover:text-amber-400'
                  }`}
                >
                  +91 82230 01415
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                <a
                  href={WORKSHOP_INFO.whatsappBase}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors"
                >
                  WhatsApp: +91 82230 01415
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a
                  href={`mailto:${WORKSHOP_INFO.email}`}
                  className={`font-medium transition-colors ${
                    isLight ? 'hover:text-amber-700' : 'hover:text-amber-400'
                  }`}
                >
                  contact@lakheraenterprises.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Bottom Copyright Row */}
        <div className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
          isLight ? 'border-slate-200 text-slate-500' : 'border-slate-900 text-slate-500'
        }`}>
          <div>
            &copy; {new Date().getFullYear()} Lakhera Enterprise. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span>Genuine Maxwell Motor Warranty</span>
            <span aria-hidden="true">·</span>
            <span>Indian Standards (IS) Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
