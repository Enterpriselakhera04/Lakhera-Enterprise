import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Zap,
  CheckCircle2,
  Cpu,
  Layers,
  Shield,
  ArrowRight,
  RotateCcw,
  Gauge,
  Video,
  Info,
  Building2,
  Factory,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Direct video imports bundled by Vite
import laserVideo from '../assets/videos/laser-cutting.mp4';
import shutterVideo from '../assets/videos/shutter-automation.mp4';
import gatesVideo from '../assets/videos/luxury-gates.mp4';
import pebVideo from '../assets/videos/peb-fabrication.mp4';
import factoryVideo from '../assets/videos/factory-floor.mp4';

interface LuxuryVideoReelProps {
  onOpenConsultation: () => void;
  onOpenQuote: () => void;
}

interface VideoChannel {
  id: string;
  title: string;
  category: string;
  durationLabel: string;
  poster: string;
  videoSrc: string;
  publicFallback: string;
  description: string;
  engineeringSpecs: { label: string; value: string }[];
}

export const LuxuryVideoReel: React.FC<LuxuryVideoReelProps> = ({
  onOpenConsultation,
  onOpenQuote,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const channels: VideoChannel[] = [
    {
      id: 'laser-cutting',
      title: 'CNC Fiber Laser Precision Cutting',
      category: 'Sub-Millimeter Architectural Fretwork',
      durationLabel: '00:18 • 4K UHD 60FPS',
      poster: '/images/laser-cutting-poster.jpg',
      videoSrc: laserVideo,
      publicFallback: '/videos/laser-cutting.mp4',
      description:
        'Watch our industrial high-wattage CNC fiber laser head slice through heavy steel plate with zero slag or edge warping. Creating intricate geometric patterns for bespoke luxury gates and architectural facades.',
      engineeringSpecs: [
        { label: 'Cutting Tolerance', value: '±0.05 mm' },
        { label: 'Laser Wattage', value: 'High-Power Fiber Resonator' },
        { label: 'Edge Quality', value: 'Zero Burrs / Smooth Bevel' },
        { label: 'Material Handling', value: 'Up to 16mm MS / 10mm SS' },
      ],
    },
    {
      id: 'shutter-automation',
      title: 'Maxwell High-Torque Motorized Automation',
      category: 'Motorized Commercial & Factory Bays',
      durationLabel: '00:15 • High-Torque Automation',
      poster: '/images/shutter-automation-poster.jpg',
      videoSrc: shutterVideo,
      publicFallback: '/videos/shutter-automation.mp4',
      description:
        'High-precision automated industrial robotic motor drive in action. Powering our heavy-duty cold-rolled galvanized steel rolling shutters with instant remote activation, geared torque multiplication, and emergency pull-chain overrides.',
      engineeringSpecs: [
        { label: 'Torque Rating', value: 'Up to 1,500 kg Force' },
        { label: 'Lift Velocity', value: 'Rapid 15 cm / sec Lift' },
        { label: 'Emergency Mode', value: 'Geared Chain Override' },
        { label: 'Lath Material', value: 'Cold-Rolled Galvanized' },
      ],
    },
    {
      id: 'luxury-gates',
      title: 'Luxury Architectural Entrance Gates',
      category: 'Bespoke Bungalow Statement Entrances',
      durationLabel: '00:14 • Master Craftsman Arc',
      poster: '/images/luxury-gate-poster.jpg',
      videoSrc: gatesVideo,
      publicFallback: '/videos/luxury-gates.mp4',
      description:
        'Master metal craftsman welding structural box framing and ornamental tubular steel for bespoke villa gates. Features greasable heavy pivot bearings, CNC laser panel inserts, and electrostatic multi-stage zinc powder coating.',
      engineeringSpecs: [
        { label: 'Structural Gauge', value: '100x50mm Heavy Box' },
        { label: 'Finish Standard', value: 'Multi-Stage Zinc Polyurethane' },
        { label: 'Hinge Bearing', value: 'Hardened Greasable Pivot' },
        { label: 'Welding Quality', value: 'MIG / TIG Shielded Arc' },
      ],
    },
    {
      id: 'industrial-sheds',
      title: 'PEB Industrial Warehouse Structures',
      category: 'Structural Heavy Steel Erection',
      durationLabel: '00:11 • Heavy Portal Fabrication',
      poster: '/images/peb-shed-poster.jpg',
      videoSrc: pebVideo,
      publicFallback: '/videos/peb-fabrication.mp4',
      description:
        'Structural steel fabrication and heavy construction welding on portal frames, box girders, and rafters. Engineered for clear-span warehouses, factory bays, and heavy logistics facilities.',
      engineeringSpecs: [
        { label: 'Clear Span', value: 'Up to 45m Column-Free' },
        { label: 'Roof Coating', value: 'AZ150 Galvalume Corrugated' },
        { label: 'Design Standard', value: 'IS 800 / IS 875 Compliant' },
        { label: 'Steel Grade', value: 'E250 / E350 High-Tensile' },
      ],
    },
    {
      id: 'factory-floor',
      title: 'Bhopal Advanced Manufacturing Facility',
      category: 'Facility Overview & Crane Bays',
      durationLabel: '00:20 • Shop-Floor Panorama',
      poster: '/images/workshop-floor-poster.jpg',
      videoSrc: factoryVideo,
      publicFallback: '/videos/factory-floor.mp4',
      description:
        'Inside Lakhera Enterprise’s centralized fabrication bays in Bhopal. Housing multi-ton overhead cranes, CNC press brakes, computerized cold-roll profiling lines, and an electrostatic powder-coating oven booth.',
      engineeringSpecs: [
        { label: 'Facility Area', value: '15,000+ sq.ft Production Bay' },
        { label: 'Overhead Gantry', value: '10-Ton Heavy Crane Lift' },
        { label: 'Monthly Output', value: '50+ Industrial Units' },
        { label: 'Location', value: 'Bhopal Industrial Hub, MP' },
      ],
    },
  ];

  const [activeChannelId, setActiveChannelId] = useState<string>(channels[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showMutePrompt, setShowMutePrompt] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];

  // Initialize and play video when activeChannelId changes
  useEffect(() => {
    setVideoError(false);
    setIsBuffering(true);
    setCurrentTime(0);

    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = isMuted;
    video.muted = isMuted;
    video.playbackRate = playbackSpeed;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        })
        .catch((err) => {
          console.log('Video autoplay note:', err);
          setIsPlaying(false);
          setIsBuffering(false);
        });
    }
  }, [activeChannelId]);

  // Synchronize muted state with the DOM element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Update playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(console.error);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const newMuted = !video.muted;
    video.muted = newMuted;
    setIsMuted(newMuted);
    setShowMutePrompt(false);
  }, []);

  const handleRestart = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().then(() => setIsPlaying(true)).catch(console.error);
  }, []);

  const cycleSpeed = useCallback(() => {
    const speeds = [1, 1.25, 1.5, 0.75];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
  }, [playbackSpeed]);

  const handleFullscreen = useCallback(() => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(console.error);
      } else {
        containerRef.current.requestFullscreen().catch(console.error);
      }
    }
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      setIsBuffering(false);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = Math.max(0, Math.min(pos * duration, duration));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section
      id="cinematic-showcase"
      className={`relative py-24 border-b transition-colors duration-200 overflow-hidden ${
        isLight
          ? 'bg-slate-100/90 border-slate-200 text-slate-900'
          : 'bg-gradient-to-b from-slate-950 via-[#070b14] to-slate-950 border-slate-800/80 text-white'
      }`}
    >
      {/* Background ambient glow */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[550px] blur-[130px] pointer-events-none rounded-full ${
          isLight ? 'bg-amber-300/20' : 'bg-amber-500/10'
        }`}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-3 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${
                isLight ? 'text-amber-700' : 'text-amber-400'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Cinematic Engineering & Motion Showcase</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-balance ${
                isLight ? 'text-slate-950' : 'text-white'
              }`}
            >
              Master Fabrication &{' '}
              <span
                className={`text-transparent bg-clip-text ${
                  isLight
                    ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700'
                    : 'bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200'
                }`}
              >
                Automation in Action
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
              Step directly inside our Bhopal manufacturing facility. High-wattage CNC fiber laser slicing with intense sparks, Maxwell high-torque motor automation, and structural steel assembly captured in 720p/1080p widescreen cinematography.
            </motion.p>
          </div>

          {/* Quick Consultation & Factory Visit Triggers */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenConsultation}
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer font-display active:scale-95"
            >
              <span>Book Masterclass Factory Visit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenQuote}
              className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Get Itemized Quote</span>
            </button>
          </div>
        </div>

        {/* Video Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Video Screen Container (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div
              ref={containerRef}
              className={`relative group rounded-3xl overflow-hidden border shadow-2xl transition-all ${
                isLight
                  ? 'border-slate-300/80 bg-slate-950 shadow-xl shadow-slate-300/60'
                  : 'border-amber-500/25 bg-slate-950 shadow-2xl shadow-amber-500/5'
              }`}
            >
              {/* Aspect Ratio Box with Video */}
              <div
                className="relative aspect-video w-full bg-slate-950 overflow-hidden cursor-pointer select-none"
                onClick={togglePlay}
              >
                {!videoError ? (
                  <video
                    ref={videoRef}
                    key={activeChannel.id}
                    poster={activeChannel.poster}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    preload="auto"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onWaiting={() => setIsBuffering(true)}
                    onPlaying={() => {
                      setIsBuffering(false);
                      setIsPlaying(true);
                    }}
                    onPause={() => setIsPlaying(false)}
                    onError={() => {
                      console.warn('Video failed to load direct src, attempting fallback');
                      if (videoRef.current && videoRef.current.src !== window.location.origin + activeChannel.publicFallback) {
                        videoRef.current.src = activeChannel.publicFallback;
                        videoRef.current.load();
                        videoRef.current.play().catch(() => setVideoError(true));
                      } else {
                        setVideoError(true);
                      }
                    }}
                    className="w-full h-full object-cover"
                  >
                    <source src={activeChannel.videoSrc} type="video/mp4" />
                    <source src={activeChannel.publicFallback} type="video/mp4" />
                  </video>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={activeChannel.poster}
                      alt={activeChannel.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80';
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-3">
                        <Video className="w-6 h-6 text-amber-400" />
                      </div>
                      <p className="text-sm font-bold text-white mb-2">{activeChannel.title}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setVideoError(false);
                          if (videoRef.current) {
                            videoRef.current.load();
                            videoRef.current.play().catch(console.error);
                          }
                        }}
                        className="px-4 py-2 text-xs font-bold bg-amber-400 text-slate-950 rounded-xl hover:bg-amber-300"
                      >
                        Retry Video Playback
                      </button>
                    </div>
                  </div>
                )}

                {/* Subtle Cinematic Vignette */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40" />

                {/* Center Play/Pause Large Action Indicator on Pause */}
                {!isPlaying && !isBuffering && !videoError && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 flex items-center justify-center shadow-2xl pl-1"
                    >
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-slate-950" />
                    </motion.div>
                  </div>
                )}

                {/* Buffering Indicator */}
                {isBuffering && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-slate-950/40 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-medium text-amber-300">Loading High-Bitrate Reel...</span>
                    </div>
                  </div>
                )}

                {/* Top Overlay Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs pointer-events-none">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-amber-400/40 text-amber-300 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold">{activeChannel.category}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-mono text-slate-300 border border-slate-700">
                      {activeChannel.durationLabel}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-amber-400/30">
                      LIVE SHOP-FLOOR
                    </span>
                  </div>
                </div>

                {/* Floating Unmute Notice (Modern browser autoplay compliance) */}
                {isMuted && showMutePrompt && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="absolute top-16 left-4 right-4 sm:left-auto sm:right-4 z-10 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-950/90 backdrop-blur-md border border-amber-400/50 text-amber-300 text-xs shadow-xl cursor-pointer hover:bg-slate-900 transition-all hover:scale-102"
                  >
                    <VolumeX className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Video muted by browser. Click to enable sound</span>
                    <span className="ml-auto underline font-bold">Unmute</span>
                  </div>
                )}

                {/* Bottom Custom Playback Controls Bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex flex-col gap-2.5 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Interactive Progress Bar */}
                  <div
                    ref={progressBarRef}
                    onClick={handleProgressClick}
                    className="relative w-full h-1.5 bg-slate-800 hover:h-2.5 transition-all rounded-full cursor-pointer group/bar"
                  >
                    {/* Buffered / Track */}
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                    {/* Scrub Thumb */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md scale-0 group-hover/bar:scale-100 transition-transform border border-amber-400"
                      style={{ left: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Controls Row */}
                  <div className="flex items-center justify-between gap-3 text-white">
                    {/* Left: Play/Pause, Restart, Volume, Timestamp */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={togglePlay}
                        className="p-2 sm:p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                        title={isPlaying ? 'Pause Video' : 'Play Video'}
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 fill-slate-950" />
                        ) : (
                          <Play className="w-4 h-4 fill-slate-950 pl-0.5" />
                        )}
                      </button>

                      <button
                        onClick={handleRestart}
                        className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800 cursor-pointer hidden sm:flex items-center justify-center"
                        title="Replay from Beginning"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={toggleMute}
                        className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800 cursor-pointer flex items-center justify-center"
                        title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4 text-slate-400" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-amber-400" />
                        )}
                      </button>

                      <div className="text-[11px] font-mono text-slate-300 tabular-nums">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>

                      <div className="text-xs font-semibold text-slate-200 truncate max-w-[140px] sm:max-w-xs hidden md:block">
                        {activeChannel.title}
                      </div>
                    </div>

                    {/* Right: Speed, Fullscreen */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={cycleSpeed}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-[11px] font-mono font-bold text-amber-400 border border-slate-800 transition-colors cursor-pointer"
                        title="Change Playback Speed"
                      >
                        {playbackSpeed}x
                      </button>

                      <button
                        onClick={handleFullscreen}
                        className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800 cursor-pointer flex items-center justify-center"
                        title="Toggle Fullscreen"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Engineering Specifications Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activeChannel.engineeringSpecs.map((spec, sIdx) => (
                <div
                  key={sIdx}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-colors ${
                    isLight
                      ? 'bg-white border-slate-200 shadow-sm'
                      : 'bg-slate-900/80 border-slate-800/80'
                  }`}
                >
                  <span className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {spec.label}
                  </span>
                  <span
                    className={`text-sm font-bold font-mono tabular-nums mt-1 ${
                      isLight ? 'text-amber-700' : 'text-amber-300'
                    }`}
                  >
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Video Description Prose */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-700 shadow-sm'
                  : 'bg-slate-900/40 border-slate-800/60 text-slate-300'
              }`}
            >
              <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm leading-relaxed">{activeChannel.description}</p>
            </div>
          </div>

          {/* Reel Channels Camera Switcher (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div
              className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              <span>Production Camera Angle:</span>
              <span className="text-[10px] font-mono text-amber-500 font-semibold">{channels.length} FEEDS ACTIVE</span>
            </div>

            {channels.map((channel) => {
              const isActive = activeChannelId === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannelId(channel.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center gap-3.5 relative overflow-hidden group ${
                    isActive
                      ? isLight
                        ? 'border-amber-500 bg-amber-50/90 shadow-md shadow-amber-500/10'
                        : 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-500/10'
                      : isLight
                      ? 'border-slate-200 bg-white hover:border-slate-300 shadow-sm hover:shadow'
                      : 'border-slate-800/90 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  {/* Active Indicator Bar on Left */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-amber-600" />
                  )}

                  {/* Channel Thumbnail Poster */}
                  <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-700 bg-slate-950">
                    <img
                      src={channel.poster}
                      alt={channel.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80';
                      }}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-colors ${
                        isActive ? 'bg-amber-500/30' : 'bg-slate-950/40 group-hover:bg-slate-950/20'
                      }`}
                    >
                      {isActive && isPlaying ? (
                        <span className="flex items-center gap-0.5">
                          <span className="w-1 h-3.5 bg-white rounded-full animate-bounce" />
                          <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:0.15s]" />
                          <span className="w-1 h-4 bg-white rounded-full animate-bounce [animation-delay:0.3s]" />
                        </span>
                      ) : (
                        <Play className="w-4 h-4 text-white fill-white" />
                      )}
                    </div>
                  </div>

                  {/* Channel Details */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-[10px] font-bold uppercase tracking-wide truncate ${
                        isLight ? 'text-amber-700' : 'text-amber-400'
                      }`}
                    >
                      {channel.category}
                    </div>
                    <div
                      className={`text-xs font-bold truncate mt-0.5 ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {channel.title}
                    </div>
                    <div
                      className={`text-[10px] mt-0.5 font-mono ${
                        isLight ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      {channel.durationLabel}
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Quick Actions in Sidebar */}
            <div className={`pt-4 border-t space-y-2.5 ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
              <button
                onClick={onOpenQuote}
                className={`w-full py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer font-bold text-xs ${
                  isLight
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md hover:shadow-lg'
                    : 'bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 shadow-lg shadow-amber-500/10'
                }`}
              >
                <Zap className="w-4 h-4 text-slate-950" />
                <span>Request Custom Blueprint Quotation</span>
              </button>

              <button
                onClick={onOpenConsultation}
                className={`w-full py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer font-semibold text-xs border ${
                  isLight
                    ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-amber-500" />
                <span>Free On-Site Engineering Survey</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
