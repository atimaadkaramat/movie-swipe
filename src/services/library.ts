import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Movie } from "../data/mockMovies";

const WATCHLIST_KEY = "@cineswipe/watchlist";
let mutationQueue: Promise<void> = Promise.resolve();

export async function getWatchlist(): Promise<Movie[]> {
  const raw = await AsyncStorage.getItem(WATCHLIST_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Movie[];
  } catch {
    return [];
  }
}

export function addToWatchlist(movie: Movie): Promise<void> {
  mutationQueue = mutationQueue.then(async () => {
    const current = await getWatchlist();
    if (current.some((item) => item.id === movie.id)) return;
    await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify([movie, ...current]));
  });
  return mutationQueue;
}

export function removeFromWatchlist(movieId: string): Promise<void> {
  mutationQueue = mutationQueue.then(async () => {
    const current = await getWatchlist();
    await AsyncStorage.setItem(
      WATCHLIST_KEY,
      JSON.stringify(current.filter((movie) => movie.id !== movieId)),
    );
  });
  return mutationQueue;
}
