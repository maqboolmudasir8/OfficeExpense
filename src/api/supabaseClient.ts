// src/api/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
// import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

// Dev
// const SUPABASE_URL = 'https://iqfasrlwsuusgzxwkiyc.supabase.co';
// const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZmFzcmx3c3V1c2d6eHdraXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Mzk2ODAsImV4cCI6MjA3OTIxNTY4MH0.VGow91dNgxd0IklGo1PV5XAU1Ewps1SI29vKVLtJUxY';

// Production
const SUPABASE_URL = 'https://uivaajrfvhzwomxccpkr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpdmFhanJmdmh6d29teGNjcGtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNzgzODMsImV4cCI6MjA4MDg1NDM4M30.llpdh3bFo9GhEQXIl9jDYe8N_Ckj6GAo1-ENPdwKsUs';

// if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
//     throw new Error('Missing Supabase environment variables. Please check your .env file.');
// }

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);