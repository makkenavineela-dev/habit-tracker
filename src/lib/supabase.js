import { createClient } from '@supabase/supabase-js';

// Replace these with your own Supabase credentials
// You can get these at https://supabase.com/
const supabaseUrl = 'https://jbuohufmgmjaaxskbrlj.supabase.co';
const supabaseAnonKey = 'sb_publishable_A-gMRg9KNLkXm2Dxpg027w_1YIS7997';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});
