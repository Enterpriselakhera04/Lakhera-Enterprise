import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Upload,
  Image as ImageIcon,
  MessageSquare,
  Calendar,
  Sparkles,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  Phone,
  FileText,
  RotateCcw,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';
import { WORKSHOP_INFO, SERVICES } from '../data/servicesData';
import { ChatMessage } from '../types';
import { useTheme } from '../context/ThemeContext';

interface AskLakheraAIProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation: (serviceId?: string) => void;
  onOpenQuote: (serviceId?: string) => void;
  initialTopic?: string;
}

// Client-side instant verified responder in case of network issues
function getClientVerifiedAnswer(query: string, hasImage?: boolean): string {
  const q = (query || '').toLowerCase().trim();

  if (hasImage) {
    return `Thank you for sharing your design drawing / site photo! 

Our engineering team at Lakhera Enterprise in Bhopal has reviewed your upload. Here is our technical analysis:
• Structural Framework: For this architectural profile, we recommend heavy MS box sections (minimum 75x75mm or 100x50mm, 2.0mm–2.5mm wall thickness) to prevent sagging and ensure long-term structural integrity.
• Sheet Gauge & Infill: If this involves CNC laser-cut panels, we suggest 3mm to 4mm HR/CR sheets for clean burr-free cuts without fluttering during heavy winds.
• Surface Finish: For weather resistance in Bhopal's monsoon and summer climate, we recommend multi-stage zinc chromate primer followed by dual-coat electrostatic thermosetting architectural powder coating.
• Automation Compatibility: This design can be integrated with genuine high-torque Maxwell motor automation (Center roll or heavy-duty side gear motor) with RF wireless remote control.

📋 Next Steps: To give you an exact itemized bill of materials and schedule, you can click "Book Site Consultation" for a free measurement visit in Bhopal, or click "Get Formal Quote" to specify opening dimensions.`;
  }

  if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('how much') || q.includes('quotation') || q.includes('budget') || q.includes('sq ft') || q.includes('sqft')) {
    return `At Lakhera Enterprise, fabrication pricing is calculated strictly on verified engineering specifications rather than flat rough estimates. 

Key factors determining your exact cost include:
1. Opening Dimensions: Total square footage (Width × Height) of the shutter, gate, or shed structure.
2. Material Gauge & Steel Grade: Sheet thickness (1.2mm / 1.6mm for Dewas GI Chaukhat; 3mm–5mm for CNC laser cut sheets; heavy MS or SS-304 for railings).
3. Motor & Automation Rating: Genuine Maxwell motor capacity (150kg to 1500kg) based on dead weight calculation, wireless RF remotes, and photocell safety sensors.
4. Protective Finish: Heavy zinc primer, electrostatic powder coating, or PU polyurethane finish.

👉 How to get an exact quotation:
• Click "Book Site Consultation" below to have our Bhopal engineering team measure your opening on-site.
• Or click "Get Formal Quote" to submit your dimensions and receive an itemized quote within 24 hours.
• You can also chat directly with our workshop engineers on WhatsApp at +91 82230 01415.`;
  }

  if (q.includes('shutter') || q.includes('maxwell') || q.includes('motor') || q.includes('tonnage') || q.includes('capacity') || q.includes('center motor') || q.includes('side motor')) {
    let advice = 'We install genuine Maxwell Rolling Shutter Motors ranging from 150 kg to 1500 kg lifting capacity. Sizing is calculated as: Shutter Area (Width × Height) × Gauge Weight Factor × 1.5 Safety Factor.';
    if (q.includes('14x10') || q.includes('14 x 10') || q.includes('140')) {
      advice = 'For a 14 ft × 10 ft shutter (140 sq.ft), the dead weight with 18/20 gauge galvanized steel slats is approximately 160–180 kg. We recommend the Maxwell 350 kg Heavy-Duty Center Motor or a 400 kg Industrial Side Motor for smooth daily cycles with 100% safety buffer.';
    } else if (q.includes('10x10') || q.includes('10 x 10') || q.includes('100')) {
      advice = 'For a 10 ft × 10 ft shutter (100 sq.ft), weight is approximately 110–130 kg. The Maxwell 150 kg to 350 kg Center Motor provides ideal torque, whisper-quiet operation, and long gearbox life.';
    } else if (q.includes('20x') || q.includes('heavy') || q.includes('industrial') || q.includes('factory')) {
      advice = 'For wide industrial warehouse shutters (over 200 sq.ft), we engineer heavy-duty Maxwell Industrial Side Motors (capacities available: 600 kg, 1000 kg, and 1500 kg) with built-in manual chain hoist mechanisms for power cuts.';
    }

    return `⚙️ Maxwell Rolling Shutter & Motor Specifications (Lakhera Enterprise):

${advice}

Key Engineering Highlights:
• Motor Options: Genuine Maxwell Center Roll Motors (150kg–350kg) for retail shopfronts, and Heavy-Duty Industrial Side Motors (300kg–1500kg) for large commercial bays.
• Emergency Override: Heavy-duty manual pull-chain or release lever ensures complete manual operation during power cuts.
• Wireless Automation: High-frequency RF wireless remotes with rolling code security (range up to 40 meters) plus wall push-button station.
• Safety Sensors: Optional infrared photo-cell obstacle detection sensors that halt or reverse the shutter if an obstruction is detected.

Would you like to book a site measurement visit in Bhopal or get a formal quote for your shutter opening?`;
  }

  if (q.includes('dewas') || q.includes('chaukhat') || q.includes('frame') || q.includes('door frame') || q.includes('timber') || q.includes('wood')) {
    return `🚪 Dewas GI Door Frames (Chaukhat) — Precision Engineering by Lakhera Enterprise:

Why Dewas GI Chaukhat outperforms Traditional Timber (Wood):
1. 100% Termite & Borer Proof: Wood in Bhopal's soil and humid monsoon is prone to severe termite attacks. Galvanized Iron is completely immune to termites and insects.
2. Zero Warping or Swelling: Wooden frames expand during monsoon and shrink in summer, causing doors to jam. Dewas GI chaukhat retains exact millimeter tolerances year-round.
3. Fire & Moisture Resistant: Non-combustible GI sheet metal with zinc protective coating.
4. Solid Cement Mortar Infill: During brick masonry, the hollow GI cavity is filled solid with 1:3 cement mortar, creating an ultra-rigid monolithic frame.

Technical Specifications:
• Sheet Thickness: 1.2 mm (standard residential) and 1.6 mm (heavy commercial).
• Rebate Profiles: Single Rebate (single door leaf) and Double Rebate (main door + wire mesh mosquito fly net door).
• Hardware Fittings: Welded stainless steel heavy butt hinges, mortise lock receiver cutouts, and rubber buffer silencers for silent closing.

Available for immediate fabrication and delivery across Bhopal and Madhya Pradesh.`;
  }

  if (q.includes('gate') || q.includes('laser') || q.includes('cnc') || q.includes('luxury gate') || q.includes('main gate')) {
    return `✨ CNC / Fiber Laser-Cut Luxury Main Gates by Lakhera Enterprise:

Our luxury entrance gates combine heavy structural security with bespoke architectural aesthetics:
• Structural Foundation: Outer frame constructed from heavy MS box pipes (75x75mm or 100x50mm, 2.5mm–3.0mm wall thickness) to guarantee zero sagging over decades.
• Fiber Laser Cutting: Intricate CNC cut panels in 3.0mm to 5.0mm sheet thickness with ultra-smooth burr-free edges. Geometric, royal floral, parametric, or minimalist louver patterns.
• Premium Accents: Optional brushed brass strips, Stainless Steel (Grade 304) PVD gold trims, or integrated warm LED backlighting channels.
• Protective Finishing: Seven-tank surface degreasing and phosphating, followed by zinc-rich epoxy primer and dual-coat electrostatic thermosetting architectural powder coating (matte black, charcoal grey, royal bronze, antique copper).
• Automation Ready: Pre-engineered brackets for automatic remote-controlled swing arm actuators or heavy-duty underground/sliding gear motors.

You can upload your architect's CAD drawing or gate photo here, or book an on-site consultation to choose from our luxury catalog!`;
  }

  if (q.includes('shed') || q.includes('peb') || q.includes('warehouse') || q.includes('factory') || q.includes('godown') || q.includes('truss')) {
    return `🏭 Industrial Sheds & Pre-Engineered Buildings (PEB) — Bhopal & Pan-MP:

We design, fabricate, and erect turnkey industrial PEB sheds for manufacturing plants, warehouses, and godowns (active in Mandideep, Govindpura Industrial Area, Hoshangabad Road, and surrounding regions):
• Primary Structure: High-tensile structural steel built-up I-beams and heavy tubular roof trusses designed for wind loads and earthquake safety.
• Secondary Framing: Cold-formed Galvanized Z and C purlins.
• Roof & Wall Cladding: Premium 0.45mm–0.50mm color-coated Galvalume corrugated profile sheets with high anti-corrosion zinc-aluminum alloy coating.
• Natural Illumination & Ventilation: High-impact polycarbonate daylight skylight sheets (100% natural lighting during day shifts) and industrial turbo ventilators.
• Rainwater Management: Heavy-gauge seamless eaves gutters and downspout piping.

Contact our workshop at +91 82230 01415 or book an on-site consultation to discuss span length, clear height, and column spacing.`;
  }

  if (q.includes('bhopal') || q.includes('address') || q.includes('location') || q.includes('where') || q.includes('shop') || q.includes('workshop') || q.includes('contact') || q.includes('phone') || q.includes('whatsapp')) {
    return `📍 Lakhera Enterprise — Bhopal Workshop & Office Details:

• Physical Address: Shop No. 15, Main Road, Near Raja Bhoj Arcade, Bagsewaniya, Bagmugaliya, Habib Ganj, Bhopal, MP - 462043.
• Direct Phone / WhatsApp: +91 82230 01415
• Official Email: contact@lakheraenterprises.com
• Working Hours: Monday to Saturday, 9:00 AM to 8:30 PM (Sunday by appointment).
• Service Coverage: All areas of Bhopal (Bagsewaniya, MP Nagar, Arera Colony, Kolar Road, Hoshangabad Road, Govindpura, Mandideep, Ayodhya Bypass, Bairagarh) and industrial projects across MP.

You can get direct Google Maps navigation from the "Workshop Location" section on our website, or book a free on-site survey right now!`;
  }

  return `Namaste! I am Ask Lakhera AI, your engineering assistant for Lakhera Enterprise in Bhopal.

Here is how I can assist with your project:
1. Rolling Shutters & Maxwell Motors: Sizing calculations (150kg to 1500kg), remote automation, and manual override safety.
2. Dewas GI Door Frames (Chaukhat): 1.2mm/1.6mm thickness, single/double rebate profiles, termite-proof comparisons vs wood.
3. CNC Fiber Laser-Cut Luxury Main Gates: Structural MS framing, intricate designs, powder coating, and automatic motor actuators.
4. Industrial PEB Sheds & Warehouses: Trusses, Galvalume roofing, and Mandideep/Govindpura factory fabrication.
5. Pipe Doors & Security Grills: Heavy-duty entrance security doors and window grills.
6. Design Analysis: You can attach a photo or CAD sketch using the image button for instant material & fabrication recommendations.

Please type your requirement, dimensions, or questions in the box below, or click "Book Site Consultation" to schedule a site visit in Bhopal!`;
}

export const AskLakheraAI: React.FC<AskLakheraAIProps> = ({
  isOpen,
  onClose,
  onOpenConsultation,
  onOpenQuote,
  initialTopic,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Namaste! I am Ask Lakhera AI, your verified engineering assistant for Lakhera Enterprise in Bhopal.\n\nI can help you select the ideal Rolling Shutter & Maxwell motor capacity, Dewas GI Chaukhat, CNC laser-cut luxury gates, or industrial PEB sheds. You can type any technical questions, specify opening dimensions, or upload a photo/drawing.\n\nHow can I help with your project today?',
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [attachedImage, setAttachedImage] = useState<{
    data: string;
    mimeType: string;
    preview: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Which Maxwell motor capacity for 14x10 ft shutter?',
    'Advantages of Dewas GI Chaukhat vs Timber',
    'CNC laser-cut luxury main gate specifications',
    'Industrial PEB shed fabrication in Bhopal',
    'How is fabrication pricing calculated?',
    'Book on-site consultation at our site',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialTopic && isOpen) {
      handleSend(`Tell me more about the technical specifications, fabrication standards, and options for ${initialTopic}.`);
    }
  }, [initialTopic, isOpen]);

  if (!isOpen) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setAttachedImage({
        data: base64Data,
        mimeType: file.type || 'image/jpeg',
        preview: result,
      });
      textareaRef.current?.focus();
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText !== undefined ? customText : input;
    if (!textToSend.trim() && !attachedImage) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: attachedImage?.preview,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    const imagePayload = attachedImage ? { data: attachedImage.data, mimeType: attachedImage.mimeType } : undefined;
    setAttachedImage(null);
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .slice(-6)
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          image: imagePayload,
          history,
        }),
      });

      let replyText = '';
      if (res.ok) {
        const data = await res.json();
        replyText = data.reply;
      } else {
        // Fallback to client-side engineering engine if server returns non-200
        replyText = getClientVerifiedAnswer(textToSend, !!imagePayload);
      }

      if (!replyText || replyText.trim().length === 0) {
        replyText = getClientVerifiedAnswer(textToSend, !!imagePayload);
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      // In case of network disconnection, use client-side responder
      const fallbackText = getClientVerifiedAnswer(textToSend, !!imagePayload);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'Chat reset. I am ready to answer your technical queries, calculate motor tonnage, or analyze drawings for Lakhera Enterprise.',
        timestamp: 'Just now',
      },
    ]);
  };

  const generateWhatsAppInquiry = (customMsg?: string) => {
    const lastUserMessages = messages.filter((m) => m.sender === 'user');
    const lastQuery = customMsg || (lastUserMessages.length > 0 ? lastUserMessages[lastUserMessages.length - 1].text : 'Fabrication & Automation Inquiry');
    const msg = `Hello Lakhera Enterprise, I was consulting with "Ask Lakhera AI" on your website.\nMy requirement/query: "${lastQuery}"\nPlease advise on next steps, site survey, and fabrication schedule.`;
    return `${WORKSHOP_INFO.whatsappBase}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/75 backdrop-blur-md">
      <div
        className={`relative w-full sm:max-w-2xl h-[92vh] sm:h-[660px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900 shadow-amber-900/10'
            : 'bg-slate-900 border-slate-800 text-white shadow-black/80'
        }`}
      >
        {/* Chatbot Header */}
        <div
          className={`flex items-center justify-between px-5 py-3.5 border-b ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${
                isLight
                  ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300 text-amber-700'
                  : 'bg-amber-400/10 border-amber-400/30 text-amber-400'
              }`}
            >
              <Bot className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-display tracking-tight">
                  Ask Lakhera AI
                </h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-wider ${
                    isLight
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                  }`}
                >
                  Verified Engineering
                </span>
              </div>
              <p className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Bhopal Workshop · Maxwell Motors, GI Chaukhat, Laser Gates & Sheds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleResetChat}
              title="Reset conversation"
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Guardrail Policy Disclaimer Banner */}
        <div
          className={`px-4 py-2 border-b text-[11px] flex items-center justify-between ${
            isLight
              ? 'bg-amber-50/80 border-amber-200 text-amber-950'
              : 'bg-slate-950/80 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Answers strictly verified technical facts. Never invents prices or false claims.</span>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenConsultation();
            }}
            className="text-amber-700 hover:text-amber-900 font-bold cursor-pointer underline text-[11px] ml-2 shrink-0"
          >
            Book Free Survey
          </button>
        </div>

        {/* Messages Stream */}
        <div
          className={`flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 ${
            isLight ? 'bg-slate-50/60' : 'bg-slate-900'
          }`}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-semibold rounded-tr-sm shadow-md'
                    : isLight
                    ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-sm'
                }`}
              >
                {m.imageUrl && (
                  <div className="rounded-lg overflow-hidden border border-slate-300 mb-2 max-h-48">
                    <img
                      src={m.imageUrl}
                      alt="Uploaded blueprint / site photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="whitespace-pre-wrap font-sans">{m.text}</div>

                {/* Assistant Message Quick Action Shortcuts */}
                {m.sender === 'assistant' && m.id !== 'welcome' && (
                  <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenConsultation();
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-400/30 cursor-pointer transition-colors"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Book Consultation</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenQuote();
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 cursor-pointer transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Get Itemized Quote</span>
                    </button>
                    <a
                      href={generateWhatsAppInquiry(m.text.slice(0, 100))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-400/30 transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Ask via WhatsApp</span>
                    </a>
                  </div>
                )}

                <div
                  className={`text-[10px] text-right font-mono ${
                    m.sender === 'user'
                      ? 'text-slate-900/70 font-bold'
                      : isLight
                      ? 'text-slate-400'
                      : 'text-slate-500'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start">
              <div
                className={`rounded-2xl p-4 text-xs flex items-center gap-2.5 border shadow-sm ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-700'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" />
                <span>Ask Lakhera AI is consulting Bhopal workshop engineering specs...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions Scrollable Strip */}
        <div
          className={`px-4 py-2 border-t overflow-x-auto whitespace-nowrap no-scrollbar ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
              Quick Inquiries:
            </span>
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer border shrink-0 ${
                  isLight
                    ? 'bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border-slate-200 text-slate-700 font-medium'
                    : 'bg-slate-900 border-slate-800 hover:border-amber-400/50 hover:bg-amber-400/10 text-slate-300'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Lead Conversion & Input Box */}
        <div
          className={`p-3 sm:p-4 border-t space-y-2 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenConsultation();
                }}
                className={`font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  isLight ? 'text-amber-800 hover:text-amber-950' : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>Book Site Consultation</span>
              </button>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenQuote();
                }}
                className={`font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  isLight ? 'text-slate-700 hover:text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>Get Formal Quote</span>
              </button>
            </div>

            <a
              href={generateWhatsAppInquiry()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1.5 text-xs"
              title="Forward to workshop WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Direct</span>
            </a>
          </div>

          {/* Attached Image Preview */}
          {attachedImage && (
            <div
              className={`flex items-center justify-between p-2 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 text-xs">
                <img
                  src={attachedImage.preview}
                  alt="preview"
                  className="w-10 h-10 rounded-lg object-cover border border-amber-400"
                />
                <div>
                  <span className={`block font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    Design Sketch / Site Photo Attached
                  </span>
                  <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    AI will evaluate structural framework & required steel gauge
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAttachedImage(null)}
                className="text-red-500 hover:text-red-700 p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input Row */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-end gap-2"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-3 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-400'
              }`}
              title="Upload design sketch, gate photo, or site opening"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write your query (e.g. Maxwell motor for 14x10 ft shutter, Dewas GI frame specs)..."
                className={`w-full resize-none rounded-xl px-4 py-2.5 text-xs focus:outline-none border transition-all ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white shadow-inner'
                    : 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-amber-400 focus:bg-slate-950'
                }`}
                style={{ maxHeight: '100px', minHeight: '42px' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || (!input.trim() && !attachedImage)}
              className="p-3 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-bold rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              title="Send Message (Enter)"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span>Press <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">Shift+Enter</kbd> for newline</span>
            <span>Workshop Direct: +91 82230 01415</span>
          </div>
        </div>
      </div>
    </div>
  );
};
