# CineSwipe

Android-first social movie discovery app.

## Current implementation

Phase 2 foundation is being built with Expo + React Native + TypeScript.

- Android application ID: `com.cineswipe.app`
- Primary navigation: Discover, Social, Library, Profile
- Discover uses the product-defining four-direction interaction:
  - left = Pass
  - right = Like
  - up = Watchlist
  - down = Details
- TMDB and Supabase are intentionally not connected yet.
- This project is completely separate from Radix Automations.

## Run locally

```bash
npm install
npx expo start
```

Then open the Android project with Expo Go or an Android emulator.

## Source of truth

Product and UX requirements live in `ROADMAP.md` and `docs/`. The approved Figma concept remains the visual reference for implementation.
