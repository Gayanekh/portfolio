// A row of public.profiles. Profiles are created by a database trigger when an
// account is created (FIX 4); the owner can read theirs and change only
// first_name, last_name and avatar_url.
export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
};
