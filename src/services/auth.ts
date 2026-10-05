import { supabase } from "./supabase";

const recoveryRedirect = "cineswipe://reset-password";

export async function signUp(email: string, password: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase.auth.signUp({ email: email.trim().toLowerCase(), password });
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
}

export async function sendPasswordReset(email: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: recoveryRedirect,
  });
}

export async function updatePassword(password: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase.auth.updateUser({ password });
}

export async function signOut() {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase.auth.signOut();
}

export async function getSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}
