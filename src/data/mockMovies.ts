export type Movie = {
  id: string;
  title: string;
  year: number;
  genres: string[];
  rating: number;
  match: number;
  poster: string;
  backdrop: string;
  synopsis: string;
};

export const mockMovies: Movie[] = [
  {
    id: "nebula-horizon",
    title: "Nebula Horizon",
    year: 2025,
    genres: ["Sci-Fi", "Drama"],
    rating: 8.9,
    match: 94,
    poster: "",
    backdrop: "",
    synopsis: "A deep-space expedition enters a region where gravity, memory and consequence no longer behave normally.",
  },
  {
    id: "midnight-signal",
    title: "Midnight Signal",
    year: 2024,
    genres: ["Mystery", "Thriller"],
    rating: 8.2,
    match: 88,
    poster: "",
    backdrop: "",
    synopsis: "A late-night radio host discovers a transmission that appears to predict events before they happen.",
  },
  {
    id: "afterlight",
    title: "Afterlight",
    year: 2023,
    genres: ["Drama", "Romance"],
    rating: 8.5,
    match: 81,
    poster: "",
    backdrop: "",
    synopsis: "Two strangers reconnect years later while trying to understand what they remember differently.",
  },
];