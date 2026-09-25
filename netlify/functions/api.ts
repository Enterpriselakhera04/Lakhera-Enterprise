import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import {
  SYSTEM_PROMPT,
  generateRefId,
  generateVerifiedEngineeringResponse,
} from '../../src/lib/engineeringEngine';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dfaoaxehhszlbgvqaiyy.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmYW9heGVoaHN6bGJndnFhaXl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMTI5NDQsImV4cCI6MjEwNTg4ODk0NH0.aToQYv6E-nl4FuYUCFK0DjJgFeK8ZIlkMRG1vci_nv0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  // Normalize path
  // Netlify redirects /api/* to /.netlify/functions/api/:splat
  const rawPath = event.path || '';
  let path = rawPath.replace('/.netlify/functions/api', '');
  if (!path.startsWith('/api')) {
    path = '/api' + (path.startsWith('/') ? path : '/' + path);
  }

  const method = event.httpMethod.toUpperCase();

  try {
    // 1. Supabase Status Check
    if (path === '/api/supabase/status' && method === 'GET') {
      try {
        const consultationsCheck = await supabase.from('consultations').select('id').limit(1);
        const quotesCheck = await supabase.from('quotes').select('id').limit(1);

        const hasConsultationsTable = !consultationsCheck.error;
        const hasQuotesTable = !quotesCheck.error;

        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            connected: true,
            projectUrl: SUPABASE_URL,
            tables: {
              consultations: hasConsultationsTable,
              quotes: hasQuotesTable,
            },
            message: hasConsultationsTable && hasQuotesTable
              ? 'Supabase database tables are active and connected on Netlify.'
              : 'Supabase connected. Database tables can be initialized using supabase-schema.sql.',
          }),
        };
      } catch (err: any) {
        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            connected: false,
            projectUrl: SUPABASE_URL,
            error: err?.message || 'Failed to reach Supabase',
          }),
        };
      }
    }

    // 2. Chat with Gemini / Engineering Fallback
    if (path === '/api/chat' && method === 'POST') {
      const body = event.body ? JSON.parse(event.body) : {};
      const { message, history, image } = body;

      if (!message && !image) {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: 'Message or image is required.' }),
        };
      }

      const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

      // Free Tier Gemini Call with automatic fallback on rate limit / quota
      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10) {
        try {
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'lakhera-enterprise-netlify',
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
            text: message || (image ? 'Please analyze this design/site image for metal fabrication.' : 'Hello'),
          });

          contents.push({
            role: 'user',
            parts: currentParts,
          });

          // Using gemini-2.5-flash for fast, high-rate-limit free tier support
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
            config: {
              systemInstruction: SYSTEM_PROMPT,
              temperature: 0.35,
            },
          });

          const reply = response.text;
          if (reply && reply.trim().length > 0) {
            // Asynchronously record lead to Supabase
            try {
              if (message && message.length > 10) {
                await supabase.from('leads').insert({
                  id: generateRefId('LEAD'),
                  inquiry: message.slice(0, 500),
                  service: 'Ask Lakhera AI Assistant (Netlify)',
                });
              }
            } catch {
              // Ignore async lead logging error
            }

            return {
              statusCode: 200,
              headers: CORS_HEADERS,
              body: JSON.stringify({ reply }),
            };
          }
        } catch (geminiError: any) {
          console.warn('Gemini API call note (free tier fallback activated):', geminiError?.message || geminiError);
          // Fall through to verified engineering response
        }
      }

      // Verified Knowledge Base Fallback
      const verifiedReply = generateVerifiedEngineeringResponse(message || '', !!image);
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ reply: verifiedReply }),
      };
    }

    // 3. Consultations - Book New Consultation
    if (path === '/api/consultations' && method === 'POST') {
      const body = event.body ? JSON.parse(event.body) : {};
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
      } = body;

      if (!customerName || !phone || !serviceId || !date || !timeSlot) {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: 'Please provide all required consultation details.' }),
        };
      }

      const bookingId = generateRefId('LE');
      const record = {
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
      } catch (err) {
        console.warn('Supabase consultation insert error on Netlify:', err);
      }

      return {
        statusCode: 201,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          success: true,
          bookingId,
          consultation: record,
          message: 'Consultation successfully scheduled with Lakhera Enterprise engineers.',
        }),
      };
    }

    // 4. Consultations - Lookup by ID or Phone
    if (path.startsWith('/api/consultations/') && method === 'GET') {
      const id = decodeURIComponent(path.replace('/api/consultations/', ''));

      try {
        const { data, error } = await supabase
          .from('consultations')
          .select('*')
          .or(`id.eq.${id},phone.eq.${id}`)
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          const mappedRecord = {
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
          return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ success: true, consultation: mappedRecord }),
          };
        }
      } catch (e) {
        console.warn('Consultation lookup error:', e);
      }

      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Consultation booking not found.' }),
      };
    }

    // 5. Consultations - Reschedule or Cancel (PATCH)
    if (path.startsWith('/api/consultations/') && method === 'PATCH') {
      const id = decodeURIComponent(path.replace('/api/consultations/', ''));
      const body = event.body ? JSON.parse(event.body) : {};
      const { date, timeSlot, status, notes } = body;

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

        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            success: true,
            consultation: { id, date, timeSlot, status, notes },
            message: status === 'cancelled'
              ? 'Consultation has been cancelled.'
              : 'Consultation slot successfully updated.',
          }),
        };
      } catch (err: any) {
        return {
          statusCode: 500,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: err?.message || 'Failed to update consultation.' }),
        };
      }
    }

    // 6. Quotes - Submit New Quote Request
    if (path === '/api/quotes' && method === 'POST') {
      const body = event.body ? JSON.parse(event.body) : {};
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
      } = body;

      if (!customerName || !phone || !serviceId) {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: 'Name, phone number, and service selection are required.' }),
        };
      }

      const quoteId = generateRefId('LQ');
      const record = {
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
        console.warn('Supabase quote insert note on Netlify:', supabaseErr);
      }

      return {
        statusCode: 201,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          success: true,
          quoteId,
          quote: record,
          message: 'Quote request submitted. Our fabrication team will review and contact you.',
        }),
      };
    }

    // Default route 404
    return {
      statusCode: 404,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: `Route not found: ${method} ${path}` }),
    };
  } catch (error: any) {
    console.error('Error handling Netlify API function:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: error?.message || 'Internal Server Error' }),
    };
  }
};
