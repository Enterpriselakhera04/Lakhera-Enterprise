import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Phone, MessageSquare, Bot, ShieldCheck, Cpu, Ruler, Sparkles, Award, Scan, Activity, Compass, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { WORKSHOP_INFO } from '../data/servicesData';
import { useTheme } from '../context/ThemeContext';
import gatesVideo from '../assets/videos/luxury-gates.mp4';

interface HeroProps {
  onOpenConsultation: () => void;
  onOpenQuote: () => void;
  onOpenAI: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenConsultation,
  onOpenQuote,
  onOpenAI,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section
      className={`relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-28 border-b transition-colors duration-200 ${
        isLight
          ? 'bg-gradient-to-b from-white via-amber-50/20 to-slate-50 border-slate-200/90 text-slate-900'
          : 'bg-slate-950 border-slate-800/80 text-white'
      }`}
    >
      {/* Background luxury gold & amber radial glows */}
      <div
        className={`absolute top-0 left-1/4 w-[600px] h-[450px] blur-[130px] pointer-events-none rounded-full ${
          isLight ? 'bg-amber-300/20' : 'bg-amber-500/10'
        }`}
      />
      <div
        className={`absolute bottom-0 right-10 w-[450px] h-[350px] blur-[100px] pointer-events-none rounded-full ${
          isLight ? 'bg-amber-200/25' : 'bg-amber-600/5'
        }`}
      />

      {/* Subtle architectural grid lines */}
      <div
        className={`absolute inset-0 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none ${
          isLight
            ? 'bg-[linear-gradient(to_right,#cbd5e140_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e140_1px,transparent_1px)]'
            : 'bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)]'
        }`}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Unboxed Metadata Trust Line (Zero-Pill Discipline) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold mb-8 tracking-wider ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}
        >
          <span className={`flex items-center gap-1.5 font-bold tracking-wide ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
            <Award className="w-4 h-4 text-amber-500" />
            Lakhera Enterprise
          </span>
          <span aria-hidden="true" className={isLight ? 'text-slate-300' : 'text-slate-700'}>·</span>
          <span>Bhopal, MP Manufacturing Yard</span>
          <span aria-hidden="true" className={isLight ? 'text-slate-300' : 'text-slate-700'}>·</span>
          <span>Heavy Structural Fabrication</span>
          <span aria-hidden="true" className={isLight ? 'text-slate-300' : 'text-slate-700'}>·</span>
          <span className={`font-semibold ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>Authorized Maxwell Automation</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-7">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight font-display leading-[1.08] text-balance ${
                isLight ? 'text-slate-950' : 'text-white'
              }`}
            >
              Luxury Metal Craft &{' '}
              <span className={`text-transparent bg-clip-text ${
                isLight
                  ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700'
                  : 'bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100'
              }`}>
                Industrial Automation
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-base sm:text-lg max-w-2xl leading-relaxed ${
                isLight ? 'text-slate-700 font-normal' : 'text-slate-300 font-light'
              }`}
            >
              Bespoke automated rolling shutters with genuine high-torque Maxwell motor drives, CNC fiber laser-cut statement luxury gates, termite-proof Dewas GI chaukhat, and pre-engineered industrial warehouse sheds in Bhopal.
            </motion.p>

            {/* Action CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3.5 pt-2"
            >
              <button
                onClick={onOpenQuote}
                className="group relative px-7 py-4 text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all shadow-xl shadow-amber-500/25 cursor-pointer flex items-center gap-2 font-display"
              >
                <span>Get a Formal Quote</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onOpenConsultation}
                className={`px-6 py-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  isLight
                    ? 'bg-white border border-slate-300 hover:border-amber-500 text-slate-900 hover:text-amber-700 shadow-md shadow-slate-100'
                    : 'bg-slate-900/90 border border-slate-700/80 hover:border-amber-400/70 hover:text-white text-slate-200 luxury-glass'
                }`}
              >
                Book Free Consultation
              </button>

              <button
                onClick={onOpenAI}
                className={`px-4 py-4 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
                  isLight
                    ? 'bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100'
                    : 'bg-amber-950/20 border border-amber-500/30 text-amber-300 hover:bg-amber-950/40'
                }`}
              >
                <Bot className="w-4 h-4 text-amber-500" />
                <span>Ask Lakhera AI</span>
              </button>
            </motion.div>

            {/* Direct Connect Quick Anchors */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`pt-4 flex flex-wrap items-center gap-6 border-t text-xs ${
                isLight ? 'border-slate-200 text-slate-600' : 'border-slate-900 text-slate-400'
              }`}
            >
              <a
                href={`tel:${WORKSHOP_INFO.phoneRaw}`}
                className={`flex items-center gap-2 transition-colors ${
                  isLight ? 'hover:text-amber-700' : 'hover:text-amber-400'
                }`}
              >
                <Phone className="w-4 h-4 text-amber-500" />
                <span className={`font-mono tabular-nums font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                  +91 82230 01415
                </span>
                <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>(Direct Workshop)</span>
              </a>

              <a
                href={WORKSHOP_INFO.whatsappBase}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-600 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                <span className={isLight ? 'text-slate-800' : 'text-slate-200'}>WhatsApp Inquiry</span>
                <span className="text-emerald-600 font-semibold font-mono">Instant Technical Response</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: Hero Visual Asset Carrier with Luxury Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div
              className={`relative rounded-3xl overflow-hidden border shadow-2xl transition-all group ${
                isLight
                  ? 'border-slate-200/90 bg-white shadow-xl shadow-slate-200/70'
                  : 'border-amber-500/25 bg-slate-900 luxury-glow'
              }`}
            >
              {/* High-Definition Autoplaying Looping Video: Craftsman Doing Welding */}
              <video
                ref={videoRef}
                src={gatesVideo}
                poster="/images/luxury-gate-poster.jpg"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="metadata"
                className="w-full h-[380px] sm:h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Engineering Blue-Laser Scanner Sweep Motion Animation */}
              <motion.div
                className="absolute inset-x-0 h-28 pointer-events-none z-20"
                style={{
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(245, 158, 11, 0.12) 40%, rgba(251, 191, 36, 0.45) 85%, rgba(255, 255, 255, 0.95) 98%, transparent 100%)',
                }}
                animate={{
                  top: ['-25%', '85%', '-25%'],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {/* Intense glowing laser beam line */}
                <div className="absolute bottom-1 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_18px_#f59e0b,0_0_30px_#fbbf24]" />
                {/* Laser scan particle points */}
                <div className="absolute bottom-0 left-1/4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#fff]" />
                <div className="absolute bottom-0 left-2/4 w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_10px_#fbbf24]" />
                <div className="absolute bottom-0 left-3/4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#fff]" />
              </motion.div>

              {/* Precision CAD / LiDAR Architectural Grid Overlay */}
              <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px]" />

              {/* Top HUD Telemetry Banner */}
              <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/40 text-amber-400 text-[11px] font-mono font-semibold tracking-wider shadow-lg">
                  <Scan className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>WELDING SCAN ACTIVE</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                </div>
                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-slate-700/80 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-1.5 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-700/80 text-slate-300 text-[10px] font-mono tracking-wide">
                    <Activity className="w-3 h-3 text-cyan-400" />
                    <span>MIG / TIG ARC</span>
                  </div>
                </div>
              </div>

              {/* Viewfinder Corner Reticles */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400/70 pointer-events-none z-15" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-400/70 pointer-events-none z-15" />
              <div className="absolute bottom-24 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-400/70 pointer-events-none z-15" />
              <div className="absolute bottom-24 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-400/70 pointer-events-none z-15" />

              {/* Scrim */}
              <div
                className={`absolute inset-0 ${
                  isLight
                    ? 'bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent'
                    : 'bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent'
                }`}
              />

              {/* In-visual trust banner at bottom */}
              <div className="absolute bottom-0 inset-x-0 p-6 space-y-2 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent z-20">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-bold text-white tracking-wide flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                    Workshop & Engineering Hub
                  </span>
                  <span className="text-amber-400 font-mono font-semibold">
                    Shop 15, Bagsewaniya
                  </span>
                </div>
                <div className="text-xs text-slate-300 leading-tight">
                  Near Raja Bhoj Arcade, Habib Ganj, Bhopal · On-site measurement surveys & drawing verification
                </div>
              </div>
            </div>

            {/* Highlight Metric Badges Adjacent to Visual */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div
                className={`p-3.5 rounded-2xl border transition-colors ${
                  isLight
                    ? 'bg-white border-slate-200 shadow-sm'
                    : 'bg-slate-900/90 border-slate-800 luxury-glass'
                }`}
              >
                <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold mb-1">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Maxwell</span>
                </div>
                <div className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Authorized Drives
                </div>
              </div>

              <div
                className={`p-3.5 rounded-2xl border transition-colors ${
                  isLight
                    ? 'bg-white border-slate-200 shadow-sm'
                    : 'bg-slate-900/90 border-slate-800 luxury-glass'
                }`}
              >
                <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Fiber CNC</span>
                </div>
                <div className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Sub-mm Tolerances
                </div>
              </div>

              <div
                className={`p-3.5 rounded-2xl border transition-colors ${
                  isLight
                    ? 'bg-white border-slate-200 shadow-sm'
                    : 'bg-slate-900/90 border-slate-800 luxury-glass'
                }`}
              >
                <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold mb-1">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Dewas GI</span>
                </div>
                <div className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  100% Termite Proof
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
