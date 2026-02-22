import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })
  : (new Proxy(
      {},
      {
        get() {
          throw new Error(
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required"
          );
        },
      }
    ) as ReturnType<typeof createClient>);
