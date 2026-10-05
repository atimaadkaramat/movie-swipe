import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Movie } from "../data/mockMovies";
import { supabase } from "./supabase";

export type TasteAction = "like" | "pass" | "watchlist";

export type TasteEvent = {
  movieId: string;
  action: TasteAction;
  movie: Movie;
  createdAt: string;
};

type RemoteAction = {
  movie_id: string;
  action: TasteAction;
  movie_snapshot: Movie | null;
  created_at: string;
};

const ACTIONS_KEY = "@cineswipe/taste-actions";
const LEGACY_WATCHLIST_KEY = "@cineswipe/watchlist";
let mutationQueue: Promise<void> = Promise.resolve();
let remoteSyncPromise: Promise<void> | null = null;

async function readLocalEvents(): Promise<TasteEvent[]> {
  const raw = await AsyncStorage.getItem(ACTIONS_KEY);
  let events: TasteEvent[] = [];

  if (raw) {
    try {
      events = JSON.parse(raw) as TasteEvent[];
    } catch {
      events = [];
    }
  }

  const legacyRaw = await AsyncStorage.getItem(LEGACY_WATCHLIST_KEY);
  if (legacyRaw) {
    try {
      const legacyMovies = JSON.parse(legacyRaw) as Movie[];
      const known = new Set(events.map((event) => event.movieId));
      const legacyEvents = legacyMovies
        .filter((movie) => !known.has(movie.id))
        .map((movie) => ({
          movieId: movie.id,
          action: "watchlist" as const,
          movie,
          createdAt: new Date().toISOString(),
        }));

      if (legacyEvents.length) {
        events = [...events, ...legacyEvents];
        await writeLocalEvents(events);
        await AsyncStorage.removeItem(LEGACY_WATCHLIST_KEY);
      }
    } catch {
      // Ignore malformed legacy storage.
    }
  }

  return events;
}

async function writeLocalEvents(events: TasteEvent[]) {
  await AsyncStorage.setItem(ACTIONS_KEY, JSON.stringify(events));
}

async function getAuthenticatedUserId() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

async function syncLocalEventsToRemote(userId: string) {
  if (!supabase) return;

  const local = await readLocalEvents();
  if (!local.length) return;

  const rows = local.map((event) => ({
    user_id: userId,
    movie_id: event.movieId,
    action: event.action,
    movie_snapshot: event.movie,
    created_at: event.createdAt,
  }));

  const { error } = await supabase
    .from("movie_actions")
    .upsert(rows, { onConflict: "user_id,movie_id" });

  if (error) throw error;
}

async function ensureRemoteSync(userId: string) {
  if (!remoteSyncPromise) {
    remoteSyncPromise = syncLocalEventsToRemote(userId).finally(() => {
      remoteSyncPromise = null;
    });
  }
  await remoteSyncPromise;
}

async function readRemoteEvents(userId: string): Promise<TasteEvent[]> {
  if (!supabase) return [];

  await ensureRemoteSync(userId);

  const { data, error } = await supabase
    .from("movie_actions")
    .select("movie_id, action, movie_snapshot, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as RemoteAction[])
    .filter((event) => event.movie_snapshot)
    .map((event) => ({
      movieId: event.movie_id,
      action: event.action,
      movie: event.movie_snapshot as Movie,
      createdAt: event.created_at,
    }));
}

async function readEvents(): Promise<TasteEvent[]> {
  const userId = await getAuthenticatedUserId();
  if (userId && supabase) {
    try {
      return await readRemoteEvents(userId);
    } catch {
      // Keep the app usable if the network/database is temporarily unavailable.
    }
  }
  return readLocalEvents();
}

export function recordTasteAction(movie: Movie, action: TasteAction): Promise<void> {
  mutationQueue = mutationQueue.then(async () => {
    const event: TasteEvent = {
      movieId: movie.id,
      action,
      movie,
      createdAt: new Date().toISOString(),
    };

    const events = await readLocalEvents();
    await writeLocalEvents([
      ...events.filter((item) => item.movieId !== movie.id),
      event,
    ]);

    const userId = await getAuthenticatedUserId();
    if (!userId || !supabase) return;

    const { error } = await supabase.from("movie_actions").upsert(
      {
        user_id: userId,
        movie_id: movie.id,
        action,
        movie_snapshot: movie,
        created_at: event.createdAt,
      },
      { onConflict: "user_id,movie_id" },
    );

    if (error) throw error;
  });

  return mutationQueue;
}

export function removeTasteAction(movieId: string): Promise<void> {
  mutationQueue = mutationQueue.then(async () => {
    const events = await readLocalEvents();
    await writeLocalEvents(events.filter((event) => event.movieId !== movieId));

    const userId = await getAuthenticatedUserId();
    if (!userId || !supabase) return;

    const { error } = await supabase
      .from("movie_actions")
      .delete()
      .eq("user_id", userId)
      .eq("movie_id", movieId);

    if (error) throw error;
  });

  return mutationQueue;
}

export async function getTasteEvents() {
  return readEvents();
}

export async function getTasteSummary() {
  const events = await readEvents();
  const liked = events.filter((event) => event.action === "like");
  const passed = events.filter((event) => event.action === "pass");
  const watchlisted = events.filter((event) => event.action === "watchlist");

  const genreScores = new Map<string, number>();
  for (const event of events) {
    const weight = event.action === "like" ? 2 : event.action === "pass" ? -2 : 1;
    for (const genre of event.movie.genres) {
      genreScores.set(genre, (genreScores.get(genre) ?? 0) + weight);
    }
  }

  const topGenres = [...genreScores.entries()]
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre]) => genre);

  return {
    total: events.length,
    liked: liked.length,
    passed: passed.length,
    watchlisted: watchlisted.length,
    topGenres,
  };
}

export async function getMovieMatch(movie: Movie): Promise<number> {
  const events = await readEvents();
  if (events.length === 0) return 70;

  const genreScores = new Map<string, number>();
  for (const event of events) {
    const weight =
      event.action === "like" ? 1 :
      event.action === "watchlist" ? 0.5 : -1;

    for (const genre of event.movie.genres) {
      genreScores.set(genre, (genreScores.get(genre) ?? 0) + weight);
    }
  }

  const signals = movie.genres.map((genre) => genreScores.get(genre) ?? 0);
  if (!signals.length) return 70;

  const average = signals.reduce((sum, value) => sum + value, 0) / signals.length;
  const confidence = Math.min(events.length / 8, 1);
  const raw = 70 + Math.max(-1, Math.min(1, average)) * 24;
  const score = 70 + (raw - 70) * confidence;

  return Math.round(Math.max(40, Math.min(96, score)));
}
