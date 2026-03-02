/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wfvxuwhxtkudxazibdlz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indmdnh1d2h4dGt1ZHhhemliZGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NjgyOTEsImV4cCI6MjA4ODA0NDI5MX0.7wTBvWXk61uTVFO9-XGfGIZdUzwE1v2RZjPfv-MY5nk';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
