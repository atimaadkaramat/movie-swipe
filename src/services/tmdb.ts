import type { Movie } from "../data/mockMovies";

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const token = process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN;

type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  genre_ids: number[];
};

type TmdbDiscoverResponse = {
  results: TmdbMovie[];
  page: number;
  total_pages: number;
};

const genres: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
};

function imageUrl(path: string | null, size: "w780" | "w1280") {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}

function toMovie(item: TmdbMovie): Movie {
  const year = item.release_date ? Number(item.release_date.slice(0, 4)) : 0;
  return {
    id: String(item.id),
    title: item.title,
    year,
    genres: item.genre_ids.map((id) => genres[id]).filter(Boolean).slice(0, 3),
    rating: Number(item.vote_average.toFixed(1)),
    // Temporary pre-personalization score. The recommendation engine will replace this.
    match: 70,
    poster: imageUrl(item.poster_path, "w780") ?? "",
    backdrop: imageUrl(item.backdrop_path, "w1280") ?? "",
    synopsis: item.overview,
  };
}

export async function fetchDiscoverMovies(page = 1): Promise<Movie[]> {
  if (!token) {
    throw new Error("Missing EXPO_PUBLIC_TMDB_ACCESS_TOKEN");
  }

  const params = new URLSearchParams({
    language: "en-US",
    region: "IN",
    include_adult: "false",
    include_video: "false",
    page: String(page),
    sort_by: "popularity.desc",
    vote_count_gte: "100",
  });

  const response = await fetch(`${BASE_URL}/discover/movie?${params.toString()}`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  const data = (await response.json()) as TmdbDiscoverResponse;
  return data.results.filter((movie) => movie.poster_path).map(toMovie);
}
