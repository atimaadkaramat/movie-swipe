import type { Movie } from "../data/mockMovies";
import { getTasteEvents, recordTasteAction, removeTasteAction } from "./taste";

export async function getWatchlist(): Promise<Movie[]> {
  const events = await getTasteEvents();
  return events
    .filter((event) => event.action === "watchlist")
    .map((event) => event.movie);
}

export function addToWatchlist(movie: Movie): Promise<void> {
  return recordTasteAction(movie, "watchlist");
}

export function removeFromWatchlist(movieId: string): Promise<void> {
  return removeTasteAction(movieId);
}
