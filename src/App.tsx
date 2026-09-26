/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { LuxuryVideoReel } from './components/LuxuryVideoReel';
import { LiveAutomationSimulator } from './components/LiveAutomationSimulator';
import { AutomationSpotlight } from './components/AutomationSpotlight';
import { LuxuryMaterialShowcase } from './components/LuxuryMaterialShowcase';
import { ConsultationSystem } from './components/ConsultationSystem';
import { WorkshopLocation } from './components/WorkshopLocation';
import { Footer } from './components/Footer';
import { MobileActionDock } from './components/MobileActionDock';
import { QuoteModal } from './components/QuoteModal';
import { AskLakheraAI } from './components/AskLakheraAI';
import { CenterAISection } from './components/CenterAISection';
import { SupabaseSyncModal } from './components/SupabaseSyncModal';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { X, Calendar } from 'lucide-react';

function MainApp() {
  const [isQuoteOpen, setIsQuoteOpen] = useState<boolean>(false);
  const [quoteServiceId, setQuoteServiceId] = useState<string | undefined>(undefined);

  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState<boolean>(false);
  const [consultationServiceId, setConsultationServiceId] = useState<string | undefined>(undefined);

  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [aiTopic, setAiTopic] = useState<string | undefined>(undefined);

  const [isSupabaseOpen, setIsSupabaseOpen] = useState<boolean>(false);

  const { theme } = useTheme();
  const isLight = theme === 'light';

  const handleOpenQuote = (serviceId?: string) => {
    setQuoteServiceId(serviceId);
    setIsQuoteOpen(true);
  };

  const handleOpenConsultation = (serviceId?: string) => {
    setConsultationServiceId(serviceId);
    const section = document.getElementById('consultation');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsConsultationModalOpen(true);
    }
  };

  const handleOpenAI = (topic?: string) => {
    setAiTopic(topic);
    setIsAIOpen(true);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isLight
          ? 'bg-white text-slate-900 selection:bg-amber-500/25 selection:text-amber-900'
          : 'bg-slate-950 text-slate-100 selection:bg-amber-400/20 selection:text-amber-300'
      }`}
    >
      {/* Navbar with 3-zone contract + Theme Switcher */}
      <Navbar
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenQuote={() => handleOpenQuote()}
        onOpenAI={() => handleOpenAI()}
      />

      <main className="flex-1">
        {/* Hero Section with Bright Luxury Styling & Motion */}
        <Hero
          onOpenConsultation={() => handleOpenConsultation()}
          onOpenQuote={() => handleOpenQuote()}
          onOpenAI={() => handleOpenAI()}
        />

        {/* Cinematic Video & Machinery Reel */}
        <LuxuryVideoReel
          onOpenConsultation={() => handleOpenConsultation()}
          onOpenQuote={() => handleOpenQuote()}
        />

        {/* Services Bento Grid & Explorer */}
        <ServicesSection
          onSelectServiceForConsultation={(serviceId) => handleOpenConsultation(serviceId)}
          onSelectServiceForQuote={(serviceId) => handleOpenQuote(serviceId)}
          onSelectServiceForAI={(serviceTitle) => handleOpenAI(serviceTitle)}
        />

        {/* Center of Webpage: Dedicated AI Engineering Chatbot Hub */}
        <CenterAISection
          onOpenAI={(topic) => handleOpenAI(topic)}
          onOpenConsultation={() => handleOpenConsultation()}
          onOpenQuote={() => handleOpenQuote()}
        />

        {/* Live Interactive Maxwell Shutter Automation Simulator */}
        <LiveAutomationSimulator
          onOpenQuote={(serviceId) => handleOpenQuote(serviceId)}
          onOpenConsultation={(serviceId) => handleOpenConsultation(serviceId)}
        />

        {/* Automatic Maxwell Motor Solutions Technical Spotlight */}
        <AutomationSpotlight
          onOpenConsultation={(serviceId) => handleOpenConsultation(serviceId)}
          onOpenQuote={(serviceId) => handleOpenQuote(serviceId)}
        />

        {/* Luxury Materials & Architectural Finishes Science */}
        <LuxuryMaterialShowcase
          onOpenQuote={(serviceId) => handleOpenQuote(serviceId)}
        />

        {/* Complete Book Consultation System (In-Page) */}
        <ConsultationSystem
          initialServiceId={consultationServiceId}
          isModal={false}
        />

        {/* Workshop Location & Map Directions */}
        <WorkshopLocation
          onOpenConsultation={() => handleOpenConsultation()}
          onOpenQuote={() => handleOpenQuote()}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenQuote={() => handleOpenQuote()}
      />

      {/* Mobile Sticky Action Dock & Floating AI Bubble */}
      <MobileActionDock
        onOpenQuote={() => handleOpenQuote()}
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenAI={() => handleOpenAI()}
      />

      {/* Get Quote Modal */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        preSelectedServiceId={quoteServiceId}
      />

      {/* Consultation Modal (if opened directly in modal context) */}
      {isConsultationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className={`relative w-full max-w-3xl my-8 rounded-3xl shadow-2xl overflow-hidden border ${
            isLight
              ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300/60'
              : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold font-display">
                  Book Engineering Consultation
                </h3>
              </div>
              <button
                onClick={() => setIsConsultationModalOpen(false)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isLight ? 'text-slate-500 hover:text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <ConsultationSystem
                initialServiceId={consultationServiceId}
                isModal={true}
                onClose={() => setIsConsultationModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Ask Lakhera AI Assistant */}
      <AskLakheraAI
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onOpenConsultation={(serviceId) => {
          setIsAIOpen(false);
          handleOpenConsultation(serviceId);
        }}
        onOpenQuote={(serviceId) => {
          setIsAIOpen(false);
          handleOpenQuote(serviceId);
        }}
        initialTopic={aiTopic}
      />

      {/* Supabase Sync & Connection Modal */}
      <SupabaseSyncModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
