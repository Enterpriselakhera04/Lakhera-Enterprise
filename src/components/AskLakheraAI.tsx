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
import { generateVerifiedEngineeringResponse, SYSTEM_PROMPT } from '../lib/engineeringEngine';

interface AskLakheraAIProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation: (serviceId?: string) => void;
  onOpenQuote: (serviceId?: string) => void;
  initialTopic?: string;
}

// Client-side instant verified responder backed by the Lakhera verified knowledge base
function getClientVerifiedAnswer(query: string, hasImage?: boolean): string {
  return generateVerifiedEngineeringResponse(query, hasImage);
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

      let replyText = '';

      // 1. Try Backend / Netlify Serverless API endpoint
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: textToSend,
            image: imagePayload,
            history,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.reply) {
            replyText = data.reply;
          }
        }
      } catch (networkErr) {
        console.warn('API chat route unavailable, trying direct client-side fallback:', networkErr);
      }

      // 2. Client-side Free-Tier Gemini API integration if configured in Netlify environment variables
      if (!replyText && typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
        const clientKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (clientKey && clientKey.length > 10 && clientKey !== 'MY_GEMINI_API_KEY') {
          try {
            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey: clientKey });

            const contents: any[] = [];
            for (const turn of history) {
              contents.push({
                role: turn.role,
                parts: [{ text: turn.text }],
              });
            }

            const currentParts: any[] = [];
            if (imagePayload?.data && imagePayload?.mimeType) {
              currentParts.push({
                inlineData: {
                  mimeType: imagePayload.mimeType,
                  data: imagePayload.data,
                },
              });
            }
            currentParts.push({ text: textToSend || 'Hello' });

            contents.push({
              role: 'user',
              parts: currentParts,
            });

            // Fast, high-capacity model designed for Gemini free tier
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents,
              config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.35,
              },
            });

            replyText = response.text || '';
          } catch (geminiErr: any) {
            // Free tier 429 rate limit or quota exceeded: gracefully fall back without breaking UI
            console.warn('Free-tier Gemini rate limit / error, activating verified engineering engine:', geminiErr?.message || geminiErr);
          }
        }
      }

      // 3. Fallback to comprehensive verified engineering engine
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
      // In case of any unexpected error, use verified engineering responder
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
