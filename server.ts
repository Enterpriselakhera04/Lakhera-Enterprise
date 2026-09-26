import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));

// Supabase Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dfaoaxehhszlbgvqaiyy.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmYW9heGVoaHN6bGJndnFhaXl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMTI5NDQsImV4cCI6MjEwNTg4ODk0NH0.aToQYv6E-nl4FuYUCFK0DjJgFeK8ZIlkMRG1vci_nv0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

import {
  SYSTEM_PROMPT,
  generateRefId,
  generateVerifiedEngineeringResponse,
} from './src/lib/engineeringEngine.js';

// In-memory fallback store for Consultations & Quotes
interface ConsultationRecord {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  propertyType: string;
  serviceId: string;
  consultationMode: 'on-site' | 'online';
  address: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'confirmed' | 'rescheduled' | 'cancelled';
  createdAt: string;
}

interface QuoteRecord {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  serviceId: string;
  propertyType: string;
  dimensions: {
    height?: string;
    width?: string;
    length?: string;
    unit: string;
    quantity: number;
  };
  materialPreference?: string;
  location: string;
  notes?: string;
  filesCount: number;
  status: 'received' | 'under-review' | 'contacted';
  createdAt: string;
}

const consultations: Map<string, ConsultationRecord> = new Map();
const quotes: Map<string, QuoteRecord> = new Map();

// Supabase Status Endpoint
app.get('/api/supabase/status', async (_req: Request, res: Response): Promise<void> => {
  try {
    const consultationsCheck = await supabase.from('consultations').select('id').limit(1);
    const quotesCheck = await supabase.from('quotes').select('id').limit(1);

    const hasConsultationsTable = !consultationsCheck.error;
    const hasQuotesTable = !quotesCheck.error;

    res.json({
      connected: true,
      projectUrl: SUPABASE_URL,
      tables: {
        consultations: hasConsultationsTable,
        quotes: hasQuotesTable,
      },
      message: hasConsultationsTable && hasQuotesTable
        ? 'Supabase database tables are active and receiving real-time data.'
        : 'Supabase is connected. Please execute the provided supabase-schema.sql in your Supabase SQL editor to create the database tables.',
    });
  } catch (err: any) {
    res.status(500).json({
      connected: false,
      error: err?.message || 'Failed to connect to Supabase',
    });
  }
});

// Gemini & Intelligent Chat Endpoint
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history, image } = req.body;

    if (!message && !image) {
      res.status(400).json({ error: 'Message or image is required.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is configured, attempt modern Gemini call
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const contents: any[] = [];

        if (Array.isArray(history) && history.length > 0) {
          for (const turn of history) {
            if (turn.role === 'user' || turn.role === 'model') {
              contents.push({
                role: turn.role,
                parts: [{ text: turn.text || turn.content || '' }],
              });
            }
          }
        }

        const currentParts: any[] = [];

        if (image && image.data && image.mimeType) {
          currentParts.push({
            inlineData: {
              mimeType: image.mimeType,
              data: image.data,
            },
          });
        }

        currentParts.push({
          text: message || (image ? 'Please analyze this design/site image for fabrication and suggest the best fabrication approach, materials, and required specifications without making up prices.' : 'Hello'),
        });

        contents.push({
          role: 'user',
          parts: currentParts,
        });

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.4,
          },
        });

        const reply = response.text;
        if (reply && reply.trim().length > 0) {
          // Log lead asynchronously to Supabase
          try {
            if (message && message.length > 10) {
              await supabase.from('leads').insert({
                id: generateRefId('LEAD'),
                inquiry: message.slice(0, 500),
                service: 'Ask Lakhera AI Assistant',
              });
            }
          } catch (e) {
            // ignore
          }

          res.json({ reply });
          return;
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to verified engineering engine:', geminiError?.message || geminiError);
      }
    }

    // High-fidelity Verified Engineering Knowledge Engine Fallback
    const verifiedReply = generateVerifiedEngineeringResponse(message || '', !!image);

    // Persist lead to Supabase asynchronously
    try {
      if (message && message.length > 10) {
        await supabase.from('leads').insert({
          id: generateRefId('LEAD'),
          inquiry: message.slice(0, 500),
          service: 'Ask Lakhera AI Assistant',
        });
      }
    } catch (e) {
      // ignore
    }

    res.json({ reply: verifiedReply });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    // Even in outer error, return verified engineering response instead of failing
    const fallbackReply = generateVerifiedEngineeringResponse(req.body?.message || '', !!req.body?.image);
    res.json({ reply: fallbackReply });
  }
});

// Book Consultation Endpoints (Supabase + In-Memory Fallback)
app.post('/api/consultations', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customerName,
      phone,
      email,
      propertyType,
      serviceId,
      consultationMode,
      address,
      date,
      timeSlot,
      notes,
    } = req.body;

    if (!customerName || !phone || !serviceId || !date || !timeSlot) {
      res.status(400).json({ error: 'Please provide all required consultation details.' });
      return;
    }

    const bookingId = generateRefId('LE');
    const record: ConsultationRecord = {
      id: bookingId,
      customerName,
      phone,
      email: email || '',
      propertyType: propertyType || 'Residential',
      serviceId,
      consultationMode: consultationMode || 'on-site',
      address: address || '',
      date,
      timeSlot,
      notes: notes || '',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // 1. Keep local copy
    consultations.set(bookingId, record);

    // 2. Persist to Supabase
    try {
      await supabase.from('consultations').insert({
        id: bookingId,
        customer_name: customerName,
        phone,
        email: email || '',
        property_type: propertyType || 'Residential',
        service_id: serviceId,
        consultation_mode: consultationMode || 'on-site',
        address: address || '',
        date,
        time_slot: timeSlot,
        notes: notes || '',
        status: 'confirmed',
      });
    } catch (supabaseErr) {
      console.warn('Supabase insert note:', supabaseErr);
    }

    res.status(201).json({
      success: true,
      bookingId,
      consultation: record,
      message: 'Consultation successfully scheduled with Lakhera Enterprise engineers.',
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to schedule consultation' });
  }
});

app.get('/api/consultations/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // 1. Try Supabase lookup
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .or(`id.eq.${id},phone.eq.${id}`)
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      const mappedRecord: ConsultationRecord = {
        id: data.id,
        customerName: data.customer_name,
        phone: data.phone,
        email: data.email,
        propertyType: data.property_type,
        serviceId: data.service_id,
        consultationMode: data.consultation_mode,
        address: data.address,
        date: data.date,
        timeSlot: data.time_slot,
        notes: data.notes,
        status: data.status,
        createdAt: data.created_at,
      };
      res.json({ success: true, consultation: mappedRecord });
      return;
    }
  } catch (e) {
    // fallback to in-memory
  }

  // 2. Fallback to in-memory
  const booking = consultations.get(id);

  if (!booking) {
    for (const record of consultations.values()) {
      if (record.phone === id || record.phone.includes(id)) {
        res.json({ success: true, consultation: record });
        return;
      }
    }
    res.status(404).json({ error: 'Consultation booking not found.' });
    return;
  }

  res.json({ success: true, consultation: booking });
});

app.patch('/api/consultations/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const booking = consultations.get(id);

  const { date, timeSlot, status, notes } = req.body;

  // 1. Update in Supabase
  try {
    await supabase
      .from('consultations')
      .update({
        ...(date ? { date } : {}),
        ...(timeSlot ? { time_slot: timeSlot } : {}),
        ...(status ? { status } : {}),
        ...(notes ? { notes } : {}),
      })
      .eq('id', id);
  } catch (e) {
    // fallback
  }

  // 2. Update in-memory
  if (booking) {
    if (date) booking.date = date;
    if (timeSlot) booking.timeSlot = timeSlot;
    if (notes) booking.notes = notes;
    if (status) booking.status = status;
    consultations.set(id, booking);
  }

  res.json({
    success: true,
    consultation: booking || { id, date, timeSlot, status },
    message: status === 'cancelled' ? 'Consultation has been cancelled.' : 'Consultation slot successfully updated.',
  });
});

// Quote Request Endpoint (Supabase + In-Memory Fallback)
app.post('/api/quotes', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customerName,
      phone,
      email,
      serviceId,
      propertyType,
      dimensions,
      materialPreference,
      location,
      notes,
      filesCount,
    } = req.body;

    if (!customerName || !phone || !serviceId) {
      res.status(400).json({ error: 'Name, phone number, and service selection are required.' });
      return;
    }

    const quoteId = generateRefId('LQ');
    const record: QuoteRecord = {
      id: quoteId,
      customerName,
      phone,
      email: email || '',
      serviceId,
      propertyType: propertyType || 'Commercial',
      dimensions: dimensions || { unit: 'feet', quantity: 1 },
      materialPreference: materialPreference || 'Standard Heavy Duty',
      location: location || 'Bhopal, MP',
      notes: notes || '',
      filesCount: Number(filesCount) || 0,
      status: 'received',
      createdAt: new Date().toISOString(),
    };

    quotes.set(quoteId, record);

    // Save to Supabase
    try {
      await supabase.from('quotes').insert({
        id: quoteId,
        customer_name: customerName,
        phone,
        email: email || '',
        service_id: serviceId,
        property_type: propertyType || 'Commercial',
        dimensions,
        material_preference: materialPreference || 'Standard Heavy Duty',
        location: location || 'Bhopal, MP',
        notes: notes || '',
        files_count: Number(filesCount) || 0,
        status: 'received',
      });
    } catch (supabaseErr) {
      console.warn('Supabase quote insert note:', supabaseErr);
    }

    res.status(201).json({
      success: true,
      quoteId,
      quote: record,
      message: 'Quote request submitted. Our fabrication team will review and contact you.',
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to submit quote' });
  }
});

// Explicitly serve static videos, images, and public assets with byte-range streaming support
const publicDir = path.join(__dirname, 'public');
app.use('/images', express.static(path.join(publicDir, 'images')));
app.use('/src/assets/images', express.static(path.join(publicDir, 'images')));
app.use('/videos', express.static(path.join(publicDir, 'videos'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  },
}));
app.use(express.static(publicDir));

// Serve frontend with Vite in development or static in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lakhera Enterprise server listening on port ${PORT}`);
    console.log(`Supabase integrated: ${SUPABASE_URL}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
