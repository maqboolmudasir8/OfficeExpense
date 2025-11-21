// src/api/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = 'https://iqfasrlwsuusgzxwkiyc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZmFzcmx3c3V1c2d6eHdraXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Mzk2ODAsImV4cCI6MjA3OTIxNTY4MH0.VGow91dNgxd0IklGo1PV5XAU1Ewps1SI29vKVLtJUxY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);