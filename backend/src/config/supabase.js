const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');
const env = require('./env');

// Cliente con la service key: uso exclusivo del backend (omite RLS).
// NUNCA exponer esta clave en el frontend.
const supabase = createClient(env.supabaseUrl, env.supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: {
    transport: WebSocket,
  },
});

module.exports = supabase;