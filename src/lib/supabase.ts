import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dfaoaxehhszlbgvqaiyy.supabase.co';
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmYW9heGVoaHN6bGJndnFhaXl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMTI5NDQsImV4cCI6MjEwNTg4ODk0NH0.aToQYv6E-nl4FuYUCFK0DjJgFeK8ZIlkMRG1vci_nv0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
