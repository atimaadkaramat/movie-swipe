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

async function readEvents(): Promise<TasteEvent[]> {
  const raw = await AsyncStorage.getItem(ACTIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as TasteEvent[];
  } catch {
    return [];
  }
}

export async function recordTasteAction(movie: Movie, action: TasteAction) {
  const events = await readEvents();
  const next = [
    ...events.filter((event) => event.movieId !== movie.id),
    { movieId: movie.id, action, movie, createdAt: new Date().toISOString() },
  ];
  await AsyncStorage.setItem(ACTIONS_KEY, JSON.stringify(next));
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
