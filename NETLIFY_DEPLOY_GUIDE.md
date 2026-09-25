# Netlify Deployment Guide for Lakhera Enterprise

This project is fully configured and ready for 1-click deployment on **Netlify**.

---

## 🚀 Quick Deployment Options

### Option 1: Git Integration (Recommended)
1. Push your repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [Netlify Dashboard](https://app.netlify.com) and click **"Add new site" > "Import an existing project"**.
3. Select your repository.
4. Netlify will automatically detect the settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
5. Click **"Deploy Site"**.

### Option 2: Netlify Drop (Manual Drag & Drop)
1. In your terminal, run:
   ```bash
   npm run build
   ```
2. Navigate to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the generated `dist/` directory into the upload box.
4. Because `dist/_redirects` is automatically included, all Single-Page-App routing and client-side fallbacks work immediately out of the box!

---

## 🔑 Environment Variables Configuration

In your Netlify Site dashboard, go to **Site configuration** > **Environment variables** > **Add a variable**:

| Variable Name | Required | Description |
| :--- | :---: | :--- |
| `GEMINI_API_KEY` | Optional | Free-tier Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey). If not provided or if daily rate limits (429) are reached, the app automatically serves from the verified engineering knowledge base with zero downtime. |
| `VITE_GEMINI_API_KEY` | Optional | Same key, used if you want client-side AI generation on static-only hosting. |
| `SUPABASE_URL` | Pre-configured | `https://dfaoaxehhszlbgvqaiyy.supabase.co` (Already included as default fallback). |
| `SUPABASE_ANON_KEY` | Pre-configured | Public anon key (Already included as default fallback). |

---

## 🗺️ Google Maps: No API Key Required!
- Lakhera Enterprise uses direct, public Google Maps Embed and GPS navigation deep-links.
- **You do NOT need a Google Maps Platform account, billing, or Maps API key.**
- It will never fail due to missing billing or quota limits.

---

## ⚡ Free-Tier Gemini API Protection
- The app uses `gemini-2.5-flash`, which is optimized for Google's free-tier rate limits (15 RPM / 1M TPM).
- If your free-tier key reaches quota exhaustion (`429 Too Many Requests`), the app automatically catches the error and serves verified industrial engineering answers from the built-in Lakhera knowledge base.
- Visitors will never see broken JSON, error screens, or failed chats.

---

## 📦 What is included in this build:
- `netlify.toml`: Preconfigured build commands, redirects for `/api/*`, and CDN asset caching for 1080p MP4 showcase reels.
- `public/_redirects`: Dual fallback for SPA routing (`/* /index.html 200`).
- `netlify/functions/api.ts`: Serverless API functions handling Chat, Consultation bookings, and Quotes.
- Client-Side Resilience: If the serverless functions are unreachable, the client automatically handles bookings and quote submissions directly via Supabase and local storage.
