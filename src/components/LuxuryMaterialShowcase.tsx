import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Sparkles, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface MaterialFinish {
  id: string;
  name: string;
  category: string;
  colorHex: string;
  borderAccent: string;
  description: string;
  durability: string;
  corrosionShield: string;
  recommendedFor: string;
  keySpecs: { label: string; value: string }[];
}

interface LuxuryMaterialShowcaseProps {
  onOpenQuote: (serviceId?: string) => void;
}

export const LuxuryMaterialShowcase: React.FC<LuxuryMaterialShowcaseProps> = ({
  onOpenQuote,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const materials: MaterialFinish[] = [
    {
      id: 'pvd-gold',
      name: 'Titanium PVD Champagne Gold on SS 304',
      category: 'Luxury Architectural Inlays & Gates',
      colorHex: 'linear-gradient(135deg, #d4af37 0%, #aa771c 50%, #fdf6c7 100%)',
      borderAccent: '#d4af37',
      description: 'Physical Vapor Deposition (PVD) titanium ceramic layer bonded to surgical-grade Stainless Steel 304. Impervious to atmospheric tarnishing, oxidation, and scratches.',
      durability: '25+ Years Luster Retention',
      corrosionShield: 'ASTM B117 Salt Spray Tested',
      recommendedFor: 'Laser-Cut Main Gates, Grand Villa Entrances, Luxury Balustrades',
      keySpecs: [
        { label: 'Substrate', value: 'AISI 304 Grade Stainless' },
        { label: 'Coating Method', value: 'Vacuum PVD Ceramic' },
        { label: 'Reflectance', value: 'Specular Mirror / Satin' },
      ],
    },
    {
      id: 'matte-black-powder',
      name: 'Architectural Matte Black UV Powder Coat',
      category: 'Exterior Heavy Gate & Pipe Framing',
      colorHex: 'linear-gradient(135deg, #181c24 0%, #0d1017 100%)',
      borderAccent: '#475569',
      description: 'Thermoset polyester powder coating baked at 200°C over a zinc-phosphate conversion base. Delivers a velvet matte texture with extreme UV resistance.',
      durability: 'High Scratch & Chip Immunity',
      corrosionShield: 'Multi-Stage Zinc Primer',
      recommendedFor: 'Modern Geometric Laser Gates, Security Pipe Doors, Exterior Railings',
      keySpecs: [
        { label: 'Film Thickness', value: '70 – 90 Microns' },
        { label: 'Curing Standard', value: '200°C Oven Baked' },
        { label: 'Gloss Level', value: 'Deep Satin Matte (<15%)' },
      ],
    },
    {
      id: 'dewas-galvanized',
      name: 'Dewas Prime Galvanized Iron (GI)',
      category: 'Door Chaukhat Frames & Rolling Slats',
      colorHex: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 50%, #64748b 100%)',
      borderAccent: '#94a3b8',
      description: 'Continuously hot-dip galvanized steel sheet with spangled zinc protective armor. Completely immune to subterranean termites and moisture swelling.',
      durability: 'Lifetime Structural Integrity',
      corrosionShield: '120 GSM Pure Zinc Coating',
      recommendedFor: 'Dewas GI Door Frames, Rolling Shutter Slats, Factory Bays',
      keySpecs: [
        { label: 'Sheet Thickness', value: '1.2mm & 1.6mm (16/18 Gauge)' },
        { label: 'Termite Resistance', value: '100% (Zero Wood Content)' },
        { label: 'Fire Rating', value: 'Non-Combustible Grade' },
      ],
    },
    {
      id: 'satin-ss316',
      name: 'Marine-Grade Satin SS 316',
      category: 'Chemical & Ultra-Durable Architectural Work',
      colorHex: 'linear-gradient(135deg, #64748b 0%, #e2e8f0 50%, #475569 100%)',
      borderAccent: '#cbd5e1',
      description: 'Molybdenum-alloyed austenitic stainless steel with directional #4 satin hairline polish. Withstands severe industrial chemicals, acid rain, and heavy outdoor exposure.',
      durability: 'Extreme Marine Durability',
      corrosionShield: 'Electropolished & Passivated',
      recommendedFor: 'Glass Balcony Standoffs, Industrial Staircases, Architectural Handrails',
      keySpecs: [
        { label: 'Alloy Composition', value: '18% Cr / 10% Ni / 2% Mo' },
        { label: 'Finish Texture', value: '#4 Satin Hairline' },
        { label: 'Weld Purging', value: '100% Argon Shielded' },
      ],
    },
  ];

  const [activeMaterialId, setActiveMaterialId] = useState<string>(materials[0].id);
  const activeMaterial = materials.find((m) => m.id === activeMaterialId) || materials[0];

  return (
    <section
      className={`py-20 border-b transition-colors duration-200 ${
        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-900 text-white'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
              isLight ? 'text-amber-700' : 'text-amber-400'
            }`}>
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>Material Science & Metallurgy</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-balance ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}>
              Engineered Finishes & Steel Alloys
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${
              isLight ? 'text-slate-700 font-normal' : 'text-slate-300 font-light'
            }`}>
              We never cut corners on metal gauge or surface treatment. Explore the exact alloy chemistry, zinc coatings, and oven-baked finishes we utilize in our fabrication.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenQuote()}
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all cursor-pointer shadow-md font-display"
            >
              Request Material Samples
            </button>
          </div>
        </div>

        {/* Material Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {materials.map((mat) => (
            <button
              key={mat.id}
              onClick={() => setActiveMaterialId(mat.id)}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                activeMaterialId === mat.id
                  ? isLight
                    ? 'border-amber-500 bg-amber-50/50 shadow-md shadow-amber-500/10'
                    : 'border-amber-400 bg-slate-900 shadow-lg shadow-amber-500/10'
                  : isLight
                  ? 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              <div>
                <div
                  className="w-full h-12 rounded-xl mb-4 border border-slate-300 shadow-inner"
                  style={{ background: mat.colorHex }}
                />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  isLight ? 'text-amber-700' : 'text-amber-400'
                }`}>
                  {mat.category}
                </span>
                <h3 className={`text-sm font-bold mt-1 leading-snug font-display ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}>
                  {mat.name}
                </h3>
              </div>

              <div className={`pt-4 border-t mt-4 text-[11px] flex items-center justify-between ${
                isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800/80 text-slate-400'
              }`}>
                <span className="font-medium">{mat.durability}</span>
                {activeMaterialId === mat.id && (
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Material Deep Dive Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMaterial.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className={`rounded-3xl border p-6 sm:p-8 transition-colors ${
              isLight
                ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/80'
                : 'border-slate-800 bg-slate-900/80 luxury-glass'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className={`flex items-center gap-2 text-xs font-bold ${
                  isLight ? 'text-amber-700' : 'text-amber-400'
                }`}>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{activeMaterial.category}</span>
                </div>

                <h3 className={`text-2xl sm:text-3xl font-extrabold font-display ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}>
                  {activeMaterial.name}
                </h3>

                <p className={`text-sm leading-relaxed ${
                  isLight ? 'text-slate-700 font-normal' : 'text-slate-300 font-light'
                }`}>
                  {activeMaterial.description}
                </p>

                <div className="pt-2 flex flex-wrap gap-4 text-xs">
                  <div className={`px-4 py-2.5 rounded-xl border ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    <span className="text-slate-500 block text-[11px] font-medium">Recommended Application:</span>
                    <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {activeMaterial.recommendedFor}
                    </span>
                  </div>
                  <div className={`px-4 py-2.5 rounded-xl border ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    <span className="text-slate-500 block text-[11px] font-medium">Corrosion Standard:</span>
                    <span className={`font-mono font-bold ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
                      {activeMaterial.corrosionShield}
                    </span>
                  </div>
                </div>
              </div>

              {/* Specs Column */}
              <div className={`lg:col-span-5 p-6 rounded-2xl border space-y-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  Technical Alloy Parameters
                </div>
                {activeMaterial.keySpecs.map((spec, idx) => (
                  <div key={idx} className={`flex justify-between border-b pb-2 text-xs ${
                    isLight ? 'border-slate-200' : 'border-slate-800/80'
                  }`}>
                    <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>{spec.label}</span>
                    <span className={`font-mono font-bold ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                      {spec.value}
                    </span>
                  </div>
                ))}

                <div className="pt-3">
                  <button
                    onClick={() => onOpenQuote()}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span>Specify in Project Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
