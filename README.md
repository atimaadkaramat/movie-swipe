# CineSwipe

Android-first social movie discovery app.

## Current implementation

Phase 4 (TMDB movie data) is in progress with Expo + React Native + TypeScript.

- Android application ID: `com.cineswipe.app`
- Primary navigation: Discover, Social, Library, Profile
- Discover uses the product-defining four-direction interaction:
  - left = Pass
  - right = Like
  - up = Watchlist
  - down = Details
- Authentication and user profiles use the CineSwipe Supabase project.
- TMDB powers the movie discovery and details data.
- CineSwipe is completely separate from Radix Automations and its Neon database.

## Run locally

```bash
npm install
npx expo start
```

Then open the Android project with Expo Go or an Android emulator.

## Source of truth

Product and UX requirements live in `ROADMAP.md` and `docs/`. The approved Figma concept remains the visual reference for implementation.

## TMDB setup

Create a local `.env` file from `.env.example` and set:

```text
EXPO_PUBLIC_TMDB_ACCESS_TOKEN=your_tmdb_api_read_access_token
```

Never commit the real token to GitHub.

The current TMDB integration supports:

- Popular discovery feed
- Paginated discovery
- Trending movies
- Movie search service
- Genre list and genre discovery service
- Similar movies service
- Movie details
- India region metadata
- Poster/backdrop image URLs
- Graceful local fallback when TMDB is unavailable

The direct TMDB client token is an interim development implementation. Before production release, move privileged API access behind a server-side proxy or equivalent protected architecture.

## Data boundaries

CineSwipe uses Supabase for authentication and user data. Radix Automations uses a separate Neon PostgreSQL database. These projects must remain isolated.
