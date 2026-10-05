import type { Movie } from "../data/mockMovies";

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const token = process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN;

export type MovieGenre = {
  id: number;
  name: string;
};

type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  genre_ids?: number[];
};

type TmdbListResponse = {
  results: TmdbMovie[];
  page: number;
  total_pages: number;
};

type TmdbDetails = TmdbMovie & {
  runtime: number | null;
  tagline: string;
  genres: MovieGenre[];
};

type TmdbGenreResponse = {
  genres: MovieGenre[];
};

const genres: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

function requireToken() {
  if (!token) throw new Error("Missing EXPO_PUBLIC_TMDB_ACCESS_TOKEN");
}

function imageUrl(path: string | null, size: "w342" | "w500" | "w780" | "w1280") {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : "";
}

function toMovie(item: TmdbMovie, genreNames?: Record<number, string>): Movie {
  const year = item.release_date ? Number(item.release_date.slice(0, 4)) : 0;
  const genreMap = genreNames ?? genres;
  return {
    id: String(item.id),
    title: item.title,
    year,
    genres: (item.genre_ids ?? []).map((id) => genreMap[id]).filter(Boolean).slice(0, 3),
    rating: Number(item.vote_average.toFixed(1)),
    match: 70,
    poster: imageUrl(item.poster_path, "w780"),
    backdrop: imageUrl(item.backdrop_path, "w1280"),
    synopsis: item.overview,
  };
}

async function request<T>(path: string, params: Record<string, string> = {}) {
  requireToken();

  const query = new URLSearchParams({ language: "en-US", ...params });
  const response = await fetch(`${BASE_URL}${path}?${query.toString()}`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let detail = "";
    try {
      const body = (await response.json()) as { status_message?: string };
      detail = body.status_message ? `: ${body.status_message}` : "";
    } catch {
      // Keep the HTTP status as the useful error when TMDB doesn't return JSON.
    }
    throw new Error(`TMDB request failed: ${response.status}${detail}`);
  }

  return (await response.json()) as T;
}

function mapList(data: TmdbListResponse) {
  return data.results.filter((movie) => movie.poster_path).map((movie) => toMovie(movie));
}

export async function fetchDiscoverMovies(page = 1) {
  const data = await request<TmdbListResponse>("/discover/movie", {
    region: "IN",
    include_adult: "false",
    include_video: "false",
    page: String(page),
    sort_by: "popularity.desc",
    vote_count_gte: "100",
  });
  return {
    movies: mapList(data),
    page: data.page,
    totalPages: data.total_pages,
  };
}

export async function fetchTrendingMovies(page = 1) {
  const data = await request<TmdbListResponse>("/trending/movie/week", {
    page: String(page),
  });
  return {
    movies: mapList(data),
    page: data.page,
    totalPages: data.total_pages,
  };
}

export async function searchMovies(query: string, page = 1) {
  const trimmed = query.trim();
  if (!trimmed) return { movies: [], page: 1, totalPages: 0 };

  const data = await request<TmdbListResponse>("/search/movie", {
    query: trimmed,
    region: "IN",
    include_adult: "false",
    page: String(page),
  });
  return {
    movies: mapList(data),
    page: data.page,
    totalPages: data.total_pages,
  };
}

export async function fetchGenres() {
  const data = await request<TmdbGenreResponse>("/genre/movie/list");
  return data.genres;
}

export async function fetchMoviesByGenre(genreId: number, page = 1) {
  const data = await request<TmdbListResponse>("/discover/movie", {
    region: "IN",
    include_adult: "false",
    include_video: "false",
    page: String(page),
    sort_by: "popularity.desc",
    with_genres: String(genreId),
    vote_count_gte: "100",
  });
  return {
    movies: mapList(data),
    page: data.page,
    totalPages: data.total_pages,
  };
}

export async function fetchSimilarMovies(id: string, page = 1) {
  const data = await request<TmdbListResponse>(
    `/movie/${encodeURIComponent(id)}/similar`,
    { page: String(page) },
  );
  return {
    movies: mapList(data),
    page: data.page,
    totalPages: data.total_pages,
  };
}

export async function fetchMovieDetails(id: string): Promise<Movie> {
  const item = await request<TmdbDetails>(
    `/movie/${encodeURIComponent(id)}`,
  );

  return toMovie(
    {
      ...item,
      genre_ids: item.genres.map((genre) => genre.id),
    },
    Object.fromEntries(item.genres.map((genre) => [genre.id, genre.name])),
  );
}
