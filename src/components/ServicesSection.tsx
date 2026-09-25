import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICES } from '../data/servicesData';
import { ServiceItem } from '../types';
import { ArrowRight, CheckCircle2, ChevronRight, FileText, Calendar, Bot, Shield, Wrench, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ServicesSectionProps {
  onSelectServiceForConsultation: (serviceId: string) => void;
  onSelectServiceForQuote: (serviceId: string) => void;
  onSelectServiceForAI: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForConsultation,
  onSelectServiceForQuote,
  onSelectServiceForAI,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'Automation & Security', label: 'Rolling Shutters & Motors' },
    { id: 'Building Products', label: 'GI Chaukhat & Grills' },
    { id: 'Architectural Metalwork', label: 'Luxury CNC Gates' },
    { id: 'Industrial Infrastructure', label: 'Industrial Sheds & PEB' },
    { id: 'Heavy & Precision Metalwork', label: 'MS & SS Fabrication' },
  ];

  const filteredServices = activeCategory === 'all'
    ? SERVICES
    : SERVICES.filter((s) => s.category.toLowerCase().includes(activeCategory.toLowerCase()) || activeCategory.toLowerCase().includes(s.category.toLowerCase()));

  return (
    <section
      id="services"
      className={`py-24 border-b transition-colors duration-200 relative ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-900 text-white'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3 max-w-2xl">
            <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 ${
              isLight ? 'text-amber-700' : 'text-amber-400'
            }`}>
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>01. Master Fabrication & Automation Portfolio</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-balance ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}>
              Architectural Metalwork & Heavy Industrial Assemblies
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${
              isLight ? 'text-slate-700 font-normal' : 'text-slate-300 font-light'
            }`}>
              Crafted in our Bhopal workshop adhering to Indian Standards (IS), genuine motor warranties, and rigorous metallurgical inspection.
            </p>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className={`flex flex-wrap gap-1.5 p-1.5 rounded-2xl self-start md:self-auto border ${
            isLight
              ? 'bg-slate-100 border-slate-200/90 shadow-inner'
              : 'bg-slate-900/90 border-slate-800 luxury-glass'
          }`}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-md'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-950 hover:bg-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Bento Grid with Motion Stagger */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className={`group flex flex-col justify-between rounded-3xl border p-7 transition-all duration-300 ${
                  isLight
                    ? 'bg-white border-slate-200 shadow-md hover:shadow-2xl hover:border-amber-400/80 shadow-slate-100'
                    : 'border-slate-800/80 bg-slate-900/50 hover:border-amber-400/50 hover:bg-slate-900/90 luxury-glass hover:shadow-2xl hover:shadow-amber-500/10'
                } ${index === 0 || index === 3 ? 'lg:col-span-2' : ''}`}
              >
                <div>
                  {/* Visual Asset */}
                  {service.image && (
                    <div className="relative mb-6 h-52 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 text-xs font-semibold text-amber-300 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-amber-400/40">
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        <span>{service.category}</span>
                      </div>
                    </div>
                  )}

                  {/* Service Heading and Subtitle */}
                  <div className="space-y-2 mb-4">
                    <h3 className={`text-xl sm:text-2xl font-bold transition-colors font-display ${
                      isLight ? 'text-slate-950 group-hover:text-amber-700' : 'text-white group-hover:text-amber-300'
                    }`}>
                      {service.title}
                    </h3>
                    <p className={`text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {service.subtitle}
                    </p>
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                    isLight ? 'text-slate-700 font-normal' : 'text-slate-300 font-light'
                  }`}>
                    {service.description}
                  </p>

                  {/* Key Technical Specifications Grid */}
                  <div className={`space-y-2 mb-6 border-t pt-4 text-xs ${
                    isLight ? 'border-slate-200' : 'border-slate-800/80'
                  }`}>
                    <div className={`font-bold mb-2 ${isLight ? 'text-slate-800' : 'text-slate-400'}`}>
                      Technical Standards:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.specifications.slice(0, 4).map((spec, sIdx) => (
                        <div
                          key={sIdx}
                          className={`p-2.5 rounded-xl border ${
                            isLight
                              ? 'bg-slate-50 border-slate-200'
                              : 'bg-slate-950/80 border-slate-800/70'
                          }`}
                        >
                          <span className={`block text-[11px] font-medium ${
                            isLight ? 'text-slate-600' : 'text-slate-400'
                          }`}>
                            {spec.label}
                          </span>
                          <span className={`font-mono font-bold tabular-nums text-xs ${
                            isLight ? 'text-amber-800' : 'text-amber-300'
                          }`}>
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Materials Line */}
                  <div className={`text-xs mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 ${
                    isLight ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    <span className="font-bold">Materials:</span>
                    {service.materials.map((m, mIdx) => (
                      <span key={mIdx} className={`font-medium ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                        {m}{mIdx < service.materials.length - 1 ? ' · ' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className={`pt-4 border-t flex flex-wrap items-center justify-between gap-3 ${
                  isLight ? 'border-slate-200' : 'border-slate-800/80'
                }`}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectServiceForQuote(service.id)}
                      className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Get Quote</span>
                    </button>

                    <button
                      onClick={() => onSelectServiceForConsultation(service.id)}
                      className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border ${
                        isLight
                          ? 'text-slate-800 bg-white hover:bg-slate-50 border-slate-300 shadow-sm'
                          : 'text-slate-200 bg-slate-800/80 hover:bg-slate-700 border-slate-700/80'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>Book Consultation</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectServiceForAI(service.title)}
                    className={`text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                      isLight ? 'text-amber-700 hover:text-amber-900' : 'text-amber-400 hover:text-amber-300'
                    }`}
                    title="Ask technical questions to Lakhera AI"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Ask AI</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
