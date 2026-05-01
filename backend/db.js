const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function initDb() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.warn('⚠️ SUPABASE_URL or SUPABASE_ANON_KEY is missing in .env');
        console.warn('⚠️ Please configure them to connect to the database.');
    }

    const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder_key');
    
    // We return the supabase client to be set in the app
    return supabase;
}

module.exports = { initDb };

