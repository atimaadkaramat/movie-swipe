import { supabase } from "./supabase";

export type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

export async function getMyProfile(): Promise<Profile | null> {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, onboarding_completed, created_at, updated_at")
    .single();

  if (error?.code === "PGRST116") return null;
  if (error) throw error;
  return data as Profile;
}

export async function updateMyProfile(input: {
  username: string;
  displayName: string;
  bio: string;
}) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) throw new Error("You are not signed in.");

  const username = input.username.trim().toLowerCase();
  const displayName = input.displayName.trim();
  const bio = input.bio.trim();

  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    throw new Error("Username must be 3–20 characters using letters, numbers, or underscores.");
  }
  if (!displayName) throw new Error("Please enter your display name.");

  const { data, error } = await supabase
    .from("profiles")
    .update({
      username,
      display_name: displayName,
      bio: bio || null,
      onboarding_completed: true,
    })
    .eq("id", userId)
    .select("id, username, display_name, avatar_url, bio, onboarding_completed, created_at, updated_at")
    .single();

  if (error) {
    if (error.code === "23505") throw new Error("That username is already taken.");
    throw error;
  }
  return data as Profile;
}
