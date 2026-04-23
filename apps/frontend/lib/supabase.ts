import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

if (supabaseUrl.includes('placeholder.supabase.co')) {
  throw new Error(
    'Invalid NEXT_PUBLIC_SUPABASE_URL: placeholder.supabase.co detected. Use your real Supabase project URL.'
  );
}

if (supabaseUrl.includes('your-project-ref') || supabaseAnonKey === 'your-anon-key') {
  throw new Error(
    'Supabase env vars are still example values. Replace them with real project credentials.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
