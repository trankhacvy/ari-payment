import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { v4 } from 'uuid';

export class Storage {
  supabase: SupabaseClient;
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY as string
    );
  }

  async uploadFiles(files: File[], address: string): Promise<string[]> {
    const results = await Promise.all(
      files.map((file) => this.uploadFile(file, address))
    );

    return results;
  }

  async uploadFile(file: File, address: string): Promise<string> {
    const filepath = `${address}/products-${v4()}`;
    const { error } = await this.supabase.storage
      .from("products")
      .upload(filepath, file);
    if (error) throw error;

    const { data } = await this.supabase.storage
      .from("products")
      .getPublicUrl(filepath);

    return data.publicUrl;
  }
}
