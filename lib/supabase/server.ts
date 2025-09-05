import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        // In Server Components, Next.js does not allow mutating cookies.
        // @supabase/ssr may attempt to refresh and write cookies; ignore here.
        try {
          cookieStore.set(name, value, options);
        } catch (_) {
          // noop outside Server Actions / Route Handlers
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set(name, "", options);
        } catch (_) {
          // noop outside Server Actions / Route Handlers
        }
      },
    },
  });
}


