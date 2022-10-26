import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "types/database";

export const database: SupabaseClient<Database> = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY as string
);
