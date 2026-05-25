const SUPABASE_CONFIG = {
  url: 'https://qjimwhvypjmyfjvttmct.supabase.co',
  anonKey: 'sb_publishable_dVzjdeMjix23pq_UW1fxHQ_HsiQmrLi',
};

window.supabaseClient = null;

if (window.supabase && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
  try {
    window.supabaseClient = window.supabase.createClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey
    );
  } catch (e) {
    console.warn('No se pudo inicializar Supabase:', e);
  }
}
