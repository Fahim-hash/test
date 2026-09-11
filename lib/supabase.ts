import { createClient } from '@supabase/supabase-js';

// KINETIX public client configuration. The publishable/anon key is safe for browser use;
// never put a Supabase service_role/secret key here.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pktnxlwlzeopgxzraamd.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_xlC7e7hggO3RxipVs8Z7EQ_RomVrWGk';

export const supabase = createClient(url, key);
