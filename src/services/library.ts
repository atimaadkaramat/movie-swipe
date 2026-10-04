import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Movie } from "../data/mockMovies";

const WATCHLIST_KEY = "@cineswipe/watchlist";

export async function getWatchlist(): Promise<Movie[]> {
  const raw = await AsyncStorage.getItem(WATCHLIST_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Movie[];
  } catch {
    return [];
  }
}

export async function addToWatchlist(movie: Movie): Promise<void> {
  const current = await getWatchlist();
  if (current.some((item) => item.id === movie.id)) return;
  await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify([movie, ...current]));
}

export async function removeFromWatchlist(movieId: string): Promise<void> {
  const current = await getWatchlist();
  await AsyncStorage.setItem(
    WATCHLIST_KEY,
    JSON.stringify(current.filter((movie) => movie.id !== movieId)),
  );
}
