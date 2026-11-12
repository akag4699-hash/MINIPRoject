// ==============================================================================
// Supabase Client Configuration
// Supports Live Supabase PostgreSQL and Storage when credentials exist.
// ==============================================================================

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;
let isConfigured = false;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    isConfigured = true;
    console.log('[SUPABASE] Initialized connection to:', supabaseUrl);
  } catch (err) {
    console.warn('[SUPABASE] Failed to initialize client. Falling back to local storage engine:', err.message);
  }
} else {
  console.log('[SUPABASE] Credentials not provided or incomplete. Running in resilient local storage engine mode.');
}

module.exports = {
  supabase,
  isConfigured
};
