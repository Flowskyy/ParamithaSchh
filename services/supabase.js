import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gdtdzafxgedriupuqxtq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkdGR6YWZ4Z2Vkcml1cHVxeHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNDI4NDQsImV4cCI6MjA4NjkxODg0NH0.EF3q4_9AEcOm_zpOyVEJWP3hKLwr2VxJbsvmCdYn0QY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
