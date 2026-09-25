import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Cpu,
  Radio,
  Shield,
  Zap,
  ArrowUp,
  ArrowDown,
  Pause,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Lock,
  Unlock,
  Volume2,
} from 'lucide-react';
import { WORKSHOP_INFO } from '../data/servicesData';
import { useTheme } from '../context/ThemeContext';

interface LiveAutomationSimulatorProps {
  onOpenQuote: (serviceId?: string) => void;
  onOpenConsultation: (serviceId?: string) => void;
}

export const LiveAutomationSimulator: React.FC<LiveAutomationSimulatorProps> = ({
  onOpenQuote,
  onOpenConsultation,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Shutter height percentage: 0 = fully closed, 100 = fully opened
  const [shutterPosition, setShutterPosition] = useState<number>(30);
  const [motorState, setMotorState] = useState<'idle' | 'opening' | 'closing' | 'obstacle' | 'emergency'>('idle');
  const [obstacleActive, setObstacleActive] = useState<boolean>(false);
  const [remotePressed, setRemotePressed] = useState<string | null>(null);

  // Motor movement loop
  useEffect(() => {
    if (motorState !== 'opening' && motorState !== 'closing') return;

    const interval = setInterval(() => {
      setShutterPosition((prev) => {
        if (motorState === 'opening') {
          if (prev >= 95) {
            setMotorState('idle');
            return 100;
          }
          return prev + 5;
        }

        if (motorState === 'closing') {
          if (obstacleActive && prev <= 35) {
            setMotorState('obstacle');
            return prev;
          }

          if (prev <= 5) {
            setMotorState('idle');
            return 0;
          }
          return prev - 5;
        }

        return prev;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [motorState, obstacleActive]);

  const handleOpen = () => {
    setRemotePressed('up');
    setTimeout(() => setRemotePressed(null), 300);
    if (motorState === 'obstacle') setObstacleActive(false);
    setMotorState('opening');
  };

  const handleClose = () => {
    setRemotePressed('down');
    setTimeout(() => setRemotePressed(null), 300);
    setMotorState('closing');
  };

  const handleStop = () => {
    setRemotePressed('stop');
    setTimeout(() => setRemotePressed(null), 300);
    setMotorState('idle');
  };

  const toggleObstacle = () => {
    setObstacleActive(!obstacleActive);
    if (!obstacleActive && motorState === 'closing') {
      setMotorState('obstacle');
    }
  };

  const handleManualOverride = () => {
    setMotorState('emergency');
    setTimeout(() => {
      setShutterPosition((prev) => (prev > 50 ? 20 : 80));
      setMotorState('idle');
    }, 1200);
  };

  return (
    <section
      className={`py-20 border-b relative overflow-hidden transition-colors duration-200 ${
        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-900 text-white'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
              isLight ? 'text-amber-700' : 'text-amber-400'
            }`}>
              <Cpu className="w-3.5 h-3.5 text-amber-500" />
              <span>Interactive Machinery Simulator</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-balance ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}>
              Test Maxwell Shutter Automation in Real-Time
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${
              isLight ? 'text-slate-700 font-normal' : 'text-slate-300 font-light'
            }`}>
              Experience the encrypted 433MHz remote commands, optical safety beam cutoff, and emergency geared manual chain mechanics of our heavy automated systems.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenQuote('maxwell-automation')}
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all cursor-pointer shadow-md font-display"
            >
              Get Motor Automation Price
            </button>
          </div>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Shutter Visualizer Elevation (7 cols) */}
          <div className={`lg:col-span-7 rounded-3xl p-6 sm:p-8 border ${
            isLight
              ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/60'
              : 'bg-slate-900/80 border-slate-800 luxury-glass'
          }`}>
            <div className={`flex items-center justify-between mb-4 border-b pb-3 text-xs ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className={`font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  MAXWELL DUAL-TORQUE TEST BENCH
                </span>
              </div>
              <span className="font-mono text-amber-600 font-bold tabular-nums">
                Position: {100 - shutterPosition}% Closed
              </span>
            </div>

            {/* Architectural Shutter Frame */}
            <div className="relative w-full h-[380px] bg-slate-950 rounded-2xl border-4 border-slate-800 overflow-hidden shadow-inner flex flex-col justify-between">
              {/* Shutter Barrel / Top Hood */}
              <div className="relative z-20 h-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b-2 border-slate-700 flex items-center justify-between px-5 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                    <Cpu className={`w-4 h-4 ${motorState === 'opening' || motorState === 'closing' ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white tracking-wide">
                      MAXWELL INDUSTRIAL DRIVE
                    </div>
                    <div className="text-[9px] font-mono text-emerald-400 font-bold">
                      STATUS: {motorState.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="text-right text-[10px] font-mono text-slate-400">
                  <div>TORQUE: 450 NM</div>
                  <div className="text-amber-400 font-bold">THERMAL: NORMAL (32°C)</div>
                </div>
              </div>

              {/* Shutter Curtain Slat Animation Layer */}
              <div className="relative flex-1 w-full bg-slate-950 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-slate-800 font-display text-4xl font-extrabold tracking-widest select-none pointer-events-none opacity-40">
                  LAKHERA
                </div>

                <motion.div
                  className="absolute top-0 inset-x-0 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 border-b-4 border-amber-400/80 shadow-2xl flex flex-col justify-end"
                  animate={{
                    height: `${100 - shutterPosition}%`,
                  }}
                  transition={{ ease: 'easeInOut', duration: 0.2 }}
                >
                  <div className="w-full h-full flex flex-col justify-evenly opacity-30 pointer-events-none">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div key={i} className="w-full h-[1px] bg-slate-900" />
                    ))}
                  </div>

                  <div className="h-6 w-full bg-slate-900 border-t border-slate-600 flex items-center justify-between px-3 text-[10px] font-mono text-amber-300">
                    <span>GALVANIZED REINFORCED SLAT</span>
                    <span>SAFETY LOCK BAR</span>
                  </div>
                </motion.div>

                {/* Optical Safety Photocell Beam */}
                <div className="absolute bottom-6 inset-x-0 flex items-center justify-between px-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-md shadow-red-500/50" />
                  <div className={`flex-1 h-[2px] mx-2 ${obstacleActive ? 'bg-red-500 shadow-lg shadow-red-500' : 'bg-red-500/20'} transition-all`} />
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-md shadow-red-500/50" />
                </div>

                {obstacleActive && (
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-red-950/90 border border-red-500 text-red-300 text-[11px] font-bold flex items-center gap-1.5 shadow-xl animate-bounce">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <span>OBSTACLE DETECTED - MOTOR AUTO-STOPPED</span>
                  </div>
                )}
              </div>

              <div className="h-4 bg-slate-800 border-t border-slate-700 flex items-center justify-center">
                <span className="text-[9px] font-mono text-slate-400 tracking-wider">
                  MASONRY LEVEL / HEAVY STEEL GUIDE CHANNEL
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Wireless Remote & Test Rig Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className={`p-6 rounded-3xl space-y-4 shadow-xl border ${
              isLight
                ? 'bg-white border-slate-200'
                : 'bg-slate-900 border-2 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 text-xs font-bold ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}>
                  <Radio className="w-4 h-4 text-amber-500" />
                  <span>Maxwell RF Remote Handset (433MHz)</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={handleOpen}
                  className={`py-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    remotePressed === 'up'
                      ? 'bg-amber-400 text-slate-950 font-bold scale-95'
                      : isLight
                      ? 'bg-slate-50 border border-slate-300 text-slate-900 hover:border-amber-500 shadow-sm'
                      : 'bg-slate-950 border border-slate-700 text-slate-200 hover:border-amber-400'
                  }`}
                >
                  <ArrowUp className="w-6 h-6 text-amber-500" />
                  <span className="text-[11px] font-bold">LIFT (UP)</span>
                </button>

                <button
                  onClick={handleStop}
                  className={`py-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    remotePressed === 'stop'
                      ? 'bg-red-500 text-white font-bold scale-95'
                      : isLight
                      ? 'bg-slate-50 border border-slate-300 text-slate-900 hover:border-red-500 shadow-sm'
                      : 'bg-slate-950 border border-slate-700 text-slate-200 hover:border-red-400'
                  }`}
                >
                  <Pause className="w-6 h-6 text-red-500" />
                  <span className="text-[11px] font-bold">STOP</span>
                </button>

                <button
                  onClick={handleClose}
                  className={`py-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    remotePressed === 'down'
                      ? 'bg-amber-400 text-slate-950 font-bold scale-95'
                      : isLight
                      ? 'bg-slate-50 border border-slate-300 text-slate-900 hover:border-amber-500 shadow-sm'
                      : 'bg-slate-950 border border-slate-700 text-slate-200 hover:border-amber-400'
                  }`}
                >
                  <ArrowDown className="w-6 h-6 text-amber-500" />
                  <span className="text-[11px] font-bold">LOWER</span>
                </button>
              </div>

              {/* Safety Sensor Toggle */}
              <div className={`pt-2 border-t flex items-center justify-between ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}>
                <div className="text-xs">
                  <div className={`font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    Photocell Sensor Test:
                  </div>
                  <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Simulate person/car in opening
                  </div>
                </div>
                <button
                  onClick={toggleObstacle}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    obstacleActive
                      ? 'bg-red-500 text-white'
                      : isLight
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {obstacleActive ? 'Obstacle Present' : 'Path Clear'}
                </button>
              </div>

              {/* Emergency Chain Hoist Simulation */}
              <div className={`pt-2 border-t flex items-center justify-between ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}>
                <div className="text-xs">
                  <div className={`font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    Emergency Manual Chain:
                  </div>
                  <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Simulate power cut bypass
                  </div>
                </div>
                <button
                  onClick={handleManualOverride}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer border ${
                    isLight
                      ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/20'
                  }`}
                >
                  Pull Chain
                </button>
              </div>
            </div>

            {/* Engineering Benefits List */}
            <div className={`p-5 rounded-2xl space-y-2 text-xs border ${
              isLight
                ? 'bg-white border-slate-200 text-slate-800 shadow-sm'
                : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="flex items-center gap-2 text-amber-600 font-bold mb-1">
                <Shield className="w-4 h-4" />
                <span>Genuine Maxwell Motor Warranty</span>
              </div>
              <p className={`leading-relaxed text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Every Maxwell motor installed by Lakhera Enterprise includes genuine factory warranty, copper-wound stators, zero-slip electromagnetic braking, and on-site annual maintenance in Bhopal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
