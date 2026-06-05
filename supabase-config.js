// Supabase Configuration Module
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// IMPORTANT: Replace these values with your actual Supabase Project credentials
const SUPABASE_URL = 'https://swaqwlilafdebynpnihq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_I730gEnoXDKhd_cK7ViLQg_4VlQ5SHD';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
