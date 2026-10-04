import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Movie } from "../data/mockMovies";

export type TasteAction = "like" | "pass" | "watchlist";

export type TasteEvent = {
  movieId: string;
  action: TasteAction;
  movie: Movie;
  createdAt: string;
};

const ACTIONS_KEY = "@cineswipe/taste-actions";
let mutationQueue: Promise<void> = Promise.resolve();

async function readEvents(): Promise<TasteEvent[]> {
  const raw = await AsyncStorage.getItem(ACTIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as TasteEvent[];
  } catch {
    return [];
  }
}

export function recordTasteAction(movie: Movie, action: TasteAction): Promise<void> {
  mutationQueue = mutationQueue.then(async () => {
    const events = await readEvents();
    const next = [
      ...events.filter((event) => event.movieId !== movie.id),
      { movieId: movie.id, action, movie, createdAt: new Date().toISOString() },
    ];
    await AsyncStorage.setItem(ACTIONS_KEY, JSON.stringify(next));
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

  const signals = movie.genres
    .map((genre) => genreScores.get(genre) ?? 0);

  if (!signals.length) return 70;

  const average = signals.reduce((sum, value) => sum + value, 0) / signals.length;
  const confidence = Math.min(events.length / 8, 1);
  const raw = 70 + Math.max(-1, Math.min(1, average)) * 24;
  const score = 70 + (raw - 70) * confidence;

  return Math.round(Math.max(40, Math.min(96, score)));
}
