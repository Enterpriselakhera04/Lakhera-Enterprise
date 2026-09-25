import React from 'react';
import { Cpu, Zap, Shield, KeyRound, Radio, Wrench, ArrowRight, CheckCircle2 } from 'lucide-react';
import { WORKSHOP_INFO } from '../data/servicesData';
import { useTheme } from '../context/ThemeContext';

interface AutomationSpotlightProps {
  onOpenConsultation: (serviceId?: string) => void;
  onOpenQuote: (serviceId?: string) => void;
}

export const AutomationSpotlight: React.FC<AutomationSpotlightProps> = ({
  onOpenConsultation,
  onOpenQuote,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const motorConfigurations = [
    {
      title: 'Maxwell Center Motor Drive',
      badge: 'Retail & Commercial',
      capacity: '150 kg – 350 kg',
      description: 'Axle-mounted central drive for balanced spring rolling shutters. Perfect for commercial showrooms, banks, and boutique storefronts.',
      features: ['Concealed installation inside shutter hood', 'Smooth high-speed opening & closing', 'Manual declutch wire for key release during power cuts'],
    },
    {
      title: 'Maxwell Heavy Industrial Side Motor',
      badge: 'Factory Bays & Logistics',
      capacity: '300 kg – 1,500 kg',
      description: 'Heavy external gear sprocket drive engineered for extra-wide, high-clearance industrial factory bay doors and distribution centers.',
      features: ['Endless manual chain block hoist for power failure', 'Anti-fall electromagnetic parachute safety brake', 'High-torque copper wound stator for frequent cycling'],
    },
    {
      title: 'Maxwell Compact Tubular Motor',
      badge: 'Architectural & Compact',
      capacity: '60 kg – 180 kg',
      description: 'Slim internal tubular motor inserted directly into the roller barrel. Ideal for compact architectural openings and perforated security screens.',
      features: ['Ultra-quiet planetary gear mechanism', 'Zero external mechanical footprint', 'Precision mechanical limit switches for stroke calibration'],
    },
  ];

  return (
    <section
      id="automation"
      className={`py-20 border-b transition-colors duration-200 ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900/40 border-slate-800 text-white'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className={`text-xs font-bold uppercase tracking-wider ${
              isLight ? 'text-amber-700' : 'text-amber-400'
            }`}>
              02. Shutter Automation Excellence
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-balance ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}>
              Authorized Maxwell Rolling Shutter Motor Solutions
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${
              isLight ? 'text-slate-700 font-normal' : 'text-slate-300 font-light'
            }`}>
              Eliminate heavy manual shutter pulling. We engineer and install genuine Maxwell automation drives with RF wireless remotes, obstacle safety sensors, and emergency manual overrides.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenQuote('maxwell-automation')}
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              Request Motor Automation Quote
            </button>
            <button
              onClick={() => onOpenConsultation('maxwell-automation')}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-colors cursor-pointer border ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              Book Site Survey
            </button>
          </div>
        </div>

        {/* 3 Motor Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {motorConfigurations.map((motor, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-between rounded-3xl p-7 transition-all duration-200 border ${
                isLight
                  ? 'bg-slate-50 border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400'
                  : 'border-slate-800 bg-slate-950 hover:border-amber-400/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-xs font-bold ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
                    {motor.badge}
                  </span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border tabular-nums ${
                    isLight
                      ? 'bg-white text-slate-800 border-slate-300'
                      : 'text-slate-400 bg-slate-900 border-slate-800'
                  }`}>
                    {motor.capacity}
                  </span>
                </div>

                <h3 className={`text-lg font-bold mb-2 font-display ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  {motor.title}
                </h3>
                <p className={`text-xs leading-relaxed mb-5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {motor.description}
                </p>

                <div className={`space-y-2 border-t pt-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                  {motor.features.map((feat, fIdx) => (
                    <div key={fIdx} className={`flex items-start gap-2 text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`pt-6 border-t mt-6 flex items-center justify-between ${
                isLight ? 'border-slate-200' : 'border-slate-800/80'
              }`}>
                <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Genuine Maxwell Warranty
                </span>
                <button
                  onClick={() => onOpenQuote('maxwell-automation')}
                  className={`text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    isLight ? 'text-amber-700 hover:text-amber-900' : 'text-amber-400 hover:text-amber-300'
                  }`}
                >
                  <span>Select Model</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Grid: Safety & Engineering Mechanisms */}
        <div className={`rounded-3xl p-6 sm:p-8 border ${
          isLight
            ? 'bg-slate-50 border-slate-200 shadow-sm'
            : 'border-slate-800 bg-slate-950/80'
        }`}>
          <div className={`text-xs font-bold uppercase tracking-wider mb-6 ${
            isLight ? 'text-slate-700' : 'text-slate-400'
          }`}>
            Key Mechanical & Electrical Safeguards:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className={`flex items-center gap-2 font-bold text-sm ${isLight ? 'text-slate-900' : 'text-amber-400'}`}>
                <Radio className="w-4 h-4 text-amber-500" />
                <span>Rolling Code Remote</span>
              </div>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                433MHz encrypted rolling code transmitter system prevents remote signal cloning and unauthorized opening.
              </p>
            </div>

            <div className="space-y-2">
              <div className={`flex items-center gap-2 font-bold text-sm ${isLight ? 'text-slate-900' : 'text-amber-400'}`}>
                <Wrench className="w-4 h-4 text-amber-500" />
                <span>Manual Chain Override</span>
              </div>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Built-in geared manual pull chain enables seamless manual door lifting and closure during electrical power outages.
              </p>
            </div>

            <div className="space-y-2">
              <div className={`flex items-center gap-2 font-bold text-sm ${isLight ? 'text-slate-900' : 'text-amber-400'}`}>
                <Shield className="w-4 h-4 text-amber-500" />
                <span>Dual Brake Safety</span>
              </div>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Electromagnetic fail-safe braking prevents unspooling or uncontrolled downward free-fall of heavy slats.
              </p>
            </div>

            <div className="space-y-2">
              <div className={`flex items-center gap-2 font-bold text-sm ${isLight ? 'text-slate-900' : 'text-amber-400'}`}>
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Thermal Protection</span>
              </div>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Internal temperature sensor automatically safeguards motor windings against overheating during heavy cycles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
