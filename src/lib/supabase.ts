import { createClient } from '@supabase/supabase-js';

const getEnvVar = (key: string, viteKey: string, fallback: string): string => {
  // Check import.meta.env (Vite client)
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
      return import.meta.env[viteKey];
    }
  } catch {
    // Ignore
  }

  // Check process.env (Node / Serverless / SSR)
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
  } catch {
    // Ignore
  }

  return fallback;
};

export const SUPABASE_URL = getEnvVar(
  'SUPABASE_URL',
  'VITE_SUPABASE_URL',
  'https://dfaoaxehhszlbgvqaiyy.supabase.co'
);

export const SUPABASE_ANON_KEY = getEnvVar(
  'SUPABASE_ANON_KEY',
  'VITE_SUPABASE_ANON_KEY',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmYW9heGVoaHN6bGJndnFhaXl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMTI5NDQsImV4cCI6MjEwNTg4ODk0NH0.aToQYv6E-nl4FuYUCFK0DjJgFeK8ZIlkMRG1vci_nv0'
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

