import React from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, ExternalLink, MessageSquare, ShieldCheck } from 'lucide-react';
import { WORKSHOP_INFO } from '../data/servicesData';
import { useTheme } from '../context/ThemeContext';

interface WorkshopLocationProps {
  onOpenConsultation: () => void;
  onOpenQuote: () => void;
}

export const WorkshopLocation: React.FC<WorkshopLocationProps> = ({
  onOpenConsultation,
  onOpenQuote,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section
      id="workshop-location"
      className={`py-20 border-b transition-colors duration-200 ${
        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-900 text-white'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 max-w-2xl mb-12">
          <div className={`text-xs font-bold uppercase tracking-wider ${
            isLight ? 'text-amber-700' : 'text-amber-400'
          }`}>
            04. Workshop & Fabrication Facility
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-balance ${
            isLight ? 'text-slate-950' : 'text-white'
          }`}>
            Visit Our Bhopal Workshop & Manufacturing Facility
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${
            isLight ? 'text-slate-700 font-normal' : 'text-slate-300 font-light'
          }`}>
            Conveniently situated on Main Road near Raja Bhoj Arcade in Bagsewaniya, Bhopal. We welcome architects, structural engineers, builders, and property owners for material selection, live motor demonstrations, and drawing reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Workshop Contact Cards & Quick Connect */}
          <div className="lg:col-span-5 space-y-4">
            {/* Primary Address Card */}
            <div className={`p-6 rounded-3xl space-y-4 border ${
              isLight
                ? 'bg-white border-slate-200 shadow-md'
                : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-3 rounded-2xl shrink-0 mt-0.5 ${
                  isLight
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-amber-400/10 border border-amber-400/30 text-amber-400'
                }`}>
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-sm font-bold mb-1 font-display ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    Official Workshop & Office Address
                  </h3>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    Shop No. 15, Main Road, Near Raja Bhoj Arcade, Bagsewaniya, Bagmugaliya, Habib Ganj, Bhopal, Madhya Pradesh - 462043
                  </p>
                </div>
              </div>

              {/* Direct Navigation Button */}
              <div className="pt-2">
                <a
                  href={WORKSHOP_INFO.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Direct Phone & WhatsApp Card */}
            <div className={`p-6 rounded-3xl space-y-4 border ${
              isLight
                ? 'bg-white border-slate-200 shadow-md'
                : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div className={`flex items-center justify-between border-b pb-3 ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isLight ? 'bg-slate-100 text-amber-600' : 'bg-slate-800 text-amber-400'}`}>
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Direct Workshop Phone
                    </div>
                    <a
                      href={`tel:${WORKSHOP_INFO.phoneRaw}`}
                      className={`font-mono text-sm font-bold hover:text-amber-600 transition-colors tabular-nums ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      +91 82230 01415
                    </a>
                  </div>
                </div>

                <a
                  href={`tel:${WORKSHOP_INFO.phoneRaw}`}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  Call Now
                </a>
              </div>

              <div className={`flex items-center justify-between border-b pb-3 ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    isLight ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Official WhatsApp
                    </div>
                    <div className="font-mono text-xs font-bold text-emerald-600">
                      +91 82230 01415
                    </div>
                  </div>
                </div>

                <a
                  href={WORKSHOP_INFO.whatsappBase}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Chat
                </a>
              </div>

              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isLight ? 'bg-slate-100 text-amber-600' : 'bg-slate-800 text-amber-400'}`}>
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Official Email
                  </div>
                  <a
                    href={`mailto:${WORKSHOP_INFO.email}`}
                    className={`text-xs font-semibold hover:text-amber-600 transition-colors ${
                      isLight ? 'text-slate-800' : 'text-slate-200'
                    }`}
                  >
                    contact@lakheraenterprises.com
                  </a>
                </div>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className={`p-5 rounded-3xl flex items-start gap-3 border ${
              isLight
                ? 'bg-white border-slate-200 shadow-sm'
                : 'bg-slate-900/60 border-slate-800'
            }`}>
              <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className={`font-bold mb-0.5 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  Workshop Operating Hours
                </div>
                <div className={`font-mono font-bold tabular-nums ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Monday to Saturday: 9:30 AM – 7:30 PM
                </div>
                <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Sunday: On-Site Measurement & Urgent Installations by Appointment
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Map Frame */}
          <div className="lg:col-span-7">
            <div className={`rounded-3xl overflow-hidden shadow-2xl border ${
              isLight
                ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/70'
                : 'bg-slate-900 border-slate-800'
            }`}>
              <div className={`p-4 border-b flex items-center justify-between ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold font-display">
                    Live Workshop Coordinates & Map
                  </span>
                </div>
                <a
                  href={WORKSHOP_INFO.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1 font-bold"
                >
                  <span>Open in Fullscreen</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Responsive Google Maps Iframe */}
              <div className="w-full h-[400px] sm:h-[450px] relative">
                <iframe
                  title="Lakhera Enterprise Workshop Location Map"
                  src={WORKSHOP_INFO.googleMapsEmbed}
                  width="100%"
                  height="100%"
                  style={
                    isLight
                      ? { border: 0 }
                      : { border: 0, filter: 'grayscale(0.2) contrast(1.1) invert(0.9) hue-rotate(180deg)' }
                  }
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              {/* Regional Coverage Bar */}
              <div className={`p-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                  <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Measurement Coverage: </span>
                  Bhopal Urban, Mandideep, Govindpura Industrial, Hoshangabad Rd, Sehore, Raisen & MP State
                </div>

                <button
                  onClick={onOpenConsultation}
                  className="text-amber-600 hover:text-amber-700 font-bold cursor-pointer underline text-xs"
                >
                  Book On-Site Measurement
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
