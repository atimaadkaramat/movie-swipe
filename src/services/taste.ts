import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Movie } from "../data/mockMovies";
import { supabase } from "./supabase";

export type TasteAction = "like" | "pass" | "watchlist";
export type TasteEvent = { movieId: string; action: TasteAction; movie: Movie; createdAt: string };
export type RatingEvent = { movieId: string; rating: number; movie: Movie; updatedAt: string };

type RemoteAction = { movie_id: string; action: TasteAction; movie_snapshot: Movie | null; created_at: string };
type RemoteRating = { movie_id: string; rating: number; movie_snapshot: Movie | null; updated_at: string };

const ACTIONS_KEY = "@cineswipe/taste-actions";
const LEGACY_WATCHLIST_KEY = "@cineswipe/watchlist";
const WATCHED_KEY = "@cineswipe/watched";
const RATINGS_KEY = "@cineswipe/ratings";
let mutationQueue: Promise<void> = Promise.resolve();
let remoteSyncPromise: Promise<void> | null = null;

async function readLocalEvents(): Promise<TasteEvent[]> {
  const raw = await AsyncStorage.getItem(ACTIONS_KEY);
  let events: TasteEvent[] = [];
  if (raw) { try { events = JSON.parse(raw) as TasteEvent[]; } catch { events = []; } }
  const legacyRaw = await AsyncStorage.getItem(LEGACY_WATCHLIST_KEY);
  if (legacyRaw) {
    try {
      const legacyMovies = JSON.parse(legacyRaw) as Movie[];
      const known = new Set(events.map((event) => event.movieId));
      const legacyEvents = legacyMovies.filter((movie) => !known.has(movie.id)).map((movie) => ({ movieId: movie.id, action: "watchlist" as const, movie, createdAt: new Date().toISOString() }));
      if (legacyEvents.length) { events = [...events, ...legacyEvents]; await writeLocalEvents(events); await AsyncStorage.removeItem(LEGACY_WATCHLIST_KEY); }
    } catch {}
  }
  return events;
}
async function writeLocalEvents(events: TasteEvent[]) { await AsyncStorage.setItem(ACTIONS_KEY, JSON.stringify(events)); }

async function readLocalWatched(): Promise<Movie[]> {
  const raw = await AsyncStorage.getItem(WATCHED_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as Movie[]; } catch { return []; }
}
async function writeLocalWatched(movies: Movie[]) { await AsyncStorage.setItem(WATCHED_KEY, JSON.stringify(movies)); }

async function readLocalRatings(): Promise<RatingEvent[]> {
  const raw = await AsyncStorage.getItem(RATINGS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as RatingEvent[]; } catch { return []; }
}
async function writeLocalRatings(ratings: RatingEvent[]) { await AsyncStorage.setItem(RATINGS_KEY, JSON.stringify(ratings)); }

async function getAuthenticatedUserId() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

async function syncLocalToRemote(userId: string) {
  if (!supabase) return;
  const [events, watched, ratings] = await Promise.all([readLocalEvents(), readLocalWatched(), readLocalRatings()]);
  if (events.length) {
    const { error } = await supabase.from("movie_actions").upsert(events.map((event) => ({ user_id: userId, movie_id: event.movieId, action: event.action, movie_snapshot: event.movie, created_at: event.createdAt })), { onConflict: "user_id,movie_id" });
    if (error) throw error;
  }
  if (watched.length) {
    const { error } = await supabase.from("movie_watched").upsert(watched.map((movie) => ({ user_id: userId, movie_id: movie.id, movie_snapshot: movie })), { onConflict: "user_id,movie_id" });
    if (error) throw error;
  }
  if (ratings.length) {
    const { error } = await supabase.from("movie_ratings").upsert(ratings.map((item) => ({ user_id: userId, movie_id: item.movieId, rating: item.rating, movie_snapshot: item.movie, updated_at: item.updatedAt })), { onConflict: "user_id,movie_id" });
    if (error) throw error;
  }
}

async function ensureRemoteSync(userId: string) {
  if (!remoteSyncPromise) remoteSyncPromise = syncLocalToRemote(userId).finally(() => { remoteSyncPromise = null; });
  await remoteSyncPromise;
}

async function readRemoteEvents(userId: string): Promise<TasteEvent[]> {
  if (!supabase) return [];
  await ensureRemoteSync(userId);
  const { data, error } = await supabase.from("movie_actions").select("movie_id, action, movie_snapshot, created_at").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as RemoteAction[]).filter((event) => event.movie_snapshot).map((event) => ({ movieId: event.movie_id, action: event.action, movie: event.movie_snapshot as Movie, createdAt: event.created_at }));
}
async function readRemoteWatched(userId: string): Promise<Movie[]> {
  if (!supabase) return [];
  await ensureRemoteSync(userId);
  const { data, error } = await supabase.from("movie_watched").select("movie_id, movie_snapshot").eq("user_id", userId).order("watched_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as { movie_id: string; movie_snapshot: Movie | null }[]).filter((item) => item.movie_snapshot).map((item) => item.movie_snapshot as Movie);
}
async function readRemoteRatings(userId: string): Promise<RatingEvent[]> {
  if (!supabase) return [];
  await ensureRemoteSync(userId);
  const { data, error } = await supabase.from("movie_ratings").select("movie_id, rating, movie_snapshot, updated_at").eq("user_id", userId).order("updated_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as RemoteRating[]).filter((item) => item.movie_snapshot).map((item) => ({ movieId: item.movie_id, rating: item.rating, movie: item.movie_snapshot as Movie, updatedAt: item.updated_at }));
}

async function readEvents() {
  const userId = await getAuthenticatedUserId();
  if (userId && supabase) { try { return await readRemoteEvents(userId); } catch {} }
  return readLocalEvents();
}
async function readWatched() {
  const userId = await getAuthenticatedUserId();
  if (userId && supabase) { try { return await readRemoteWatched(userId); } catch {} }
  return readLocalWatched();
}
async function readRatings() {
  const userId = await getAuthenticatedUserId();
  if (userId && supabase) { try { return await readRemoteRatings(userId); } catch {} }
  return readLocalRatings();
}

export function recordTasteAction(movie: Movie, action: TasteAction): Promise<void> {
  mutationQueue = mutationQueue.then(async () => {
    const event = { movieId: movie.id, action, movie, createdAt: new Date().toISOString() };
    await writeLocalEvents([...(await readLocalEvents()).filter((item) => item.movieId !== movie.id), event]);
    const userId = await getAuthenticatedUserId();
    if (!userId || !supabase) return;
    const { error } = await supabase.from("movie_actions").upsert({ user_id: userId, movie_id: movie.id, action, movie_snapshot: movie, created_at: event.createdAt }, { onConflict: "user_id,movie_id" });
    if (error) throw error;
  });
  return mutationQueue;
}

export function removeTasteAction(movieId: string): Promise<void> {
  mutationQueue = mutationQueue.then(async () => {
    await writeLocalEvents((await readLocalEvents()).filter((event) => event.movieId !== movieId));
    const userId = await getAuthenticatedUserId();
    if (!userId || !supabase) return;
    const { error } = await supabase.from("movie_actions").delete().eq("user_id", userId).eq("movie_id", movieId);
    if (error) throw error;
  });
  return mutationQueue;
}

export async function markWatched(movie: Movie): Promise<void> {
  mutationQueue = mutationQueue.then(async () => {
    const watched = await readLocalWatched();
    await writeLocalWatched([...watched.filter((item) => item.id !== movie.id), movie]);
    const userId = await getAuthenticatedUserId();
    if (!userId || !supabase) return;
    const { error } = await supabase.from("movie_watched").upsert({ user_id: userId, movie_id: movie.id, movie_snapshot: movie }, { onConflict: "user_id,movie_id" });
    if (error) throw error;
  });
  return mutationQueue;
}

export async function removeWatched(movieId: string): Promise<void> {
  mutationQueue = mutationQueue.then(async () => {
    await writeLocalWatched((await readLocalWatched()).filter((movie) => movie.id !== movieId));
    const userId = await getAuthenticatedUserId();
    if (!userId || !supabase) return;
    const { error } = await supabase.from("movie_watched").delete().eq("user_id", userId).eq("movie_id", movieId);
    if (error) throw error;
  });
  return mutationQueue;
}

export async function rateMovie(movie: Movie, rating: number): Promise<void> {
  if (!Number.isInteger(rating) || rating < 1 || rating > 10) throw new Error("Rating must be between 1 and 10.");
  await markWatched(movie);
  mutationQueue = mutationQueue.then(async () => {
    const item = { movieId: movie.id, rating, movie, updatedAt: new Date().toISOString() };
    await writeLocalRatings([...(await readLocalRatings()).filter((entry) => entry.movieId !== movie.id), item]);
    const userId = await getAuthenticatedUserId();
    if (!userId || !supabase) return;
    const { error } = await supabase.from("movie_ratings").upsert({ user_id: userId, movie_id: movie.id, rating, movie_snapshot: movie, updated_at: item.updatedAt }, { onConflict: "user_id,movie_id" });
    if (error) throw error;
  });
  return mutationQueue;
}

export async function getTasteEvents() { return readEvents(); }
export async function getWatchedMovies() { return readWatched(); }
export async function getRatings() { return readRatings(); }

export async function getTasteSummary() {
  const [events, watched, ratings] = await Promise.all([readEvents(), readWatched(), readRatings()]);
  const genreScores = new Map<string, number>();
  for (const event of events) {
    const weight = event.action === "like" ? 2 : event.action === "watchlist" ? 1 : -2;
    for (const genre of event.movie.genres) genreScores.set(genre, (genreScores.get(genre) ?? 0) + weight);
  }
  for (const movie of watched) for (const genre of movie.genres) genreScores.set(genre, (genreScores.get(genre) ?? 0) + 1);
  const topGenres = [...genreScores.entries()].filter(([, score]) => score > 0).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([genre]) => genre);
  return { total: events.length + watched.length, liked: events.filter((e) => e.action === "like").length, passed: events.filter((e) => e.action === "pass").length, watchlisted: events.filter((e) => e.action === "watchlist").length, watched: watched.length, rated: ratings.length, topGenres };
}

export async function getMovieMatch(movie: Movie): Promise<number> {
  const [events, watched, ratings] = await Promise.all([readEvents(), readWatched(), readRatings()]);
  if (!events.length && !watched.length) return 70;
  const genreScores = new Map<string, number>();
  for (const event of events) {
    const weight = event.action === "like" ? 1 : event.action === "watchlist" ? 0.5 : -1;
    for (const genre of event.movie.genres) genreScores.set(genre, (genreScores.get(genre) ?? 0) + weight);
  }
  for (const movie of watched) for (const genre of movie.genres) genreScores.set(genre, (genreScores.get(genre) ?? 0) + 0.75);
  for (const item of ratings) {
    const weight = (item.rating - 5.5) / 4.5;
    for (const genre of item.movie.genres) genreScores.set(genre, (genreScores.get(genre) ?? 0) + weight);
  }
  const signals = movie.genres.map((genre) => genreScores.get(genre) ?? 0);
  if (!signals.length) return 70;
  const average = signals.reduce((sum, value) => sum + value, 0) / signals.length;
  const confidence = Math.min((events.length + watched.length + ratings.length) / 12, 1);
  const raw = 70 + Math.max(-1, Math.min(1, average)) * 24;
  return Math.round(Math.max(40, Math.min(96, 70 + (raw - 70) * confidence)));
}
