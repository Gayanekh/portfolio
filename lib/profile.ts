import type { SupabaseClient } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
};

export async function createProfile(
  supabase: SupabaseClient,
  userId: string,
  firstName: string,
  lastName: string,
) {
  return supabase.from("profiles").upsert(
    { id: userId, first_name: firstName, last_name: lastName },
    { onConflict: "id" },
  );
}
