# MovieSwipe

An Android-first social movie discovery app built around swipe-based discovery, personal taste, recommendations, and social movie activity.

## Core idea
Discover → Swipe → Like/Pass/Save → Watch → Rate → Improve taste profile → Get better recommendations → Follow people with similar taste.

## Project boundaries
- Android application only for the initial release.
- Separate product from Radix Automations.
- Separate GitHub repository.
- Separate Supabase project and database.
- No dependency on the Radix website, Radix APIs, Radix authentication, or Radix Neon database.
- Free-first architecture: avoid paid infrastructure until a real free-tier limitation is reached.

## Planned stack
- Expo + React Native + TypeScript
- Expo Router
- Supabase PostgreSQL + Auth + Realtime
- TMDB API for movie metadata
- Resend for email
- GitHub for source control
- Mobbin for UI/UX research
- Replit for development/prototyping where useful
- Context7 for current technical documentation
- PostHog later for analytics
- Expo/EAS for Android builds and distribution

## Roadmap
See ROADMAP.md.

## Development rule
Repository documentation is the source of truth. When implementation decisions change, update the relevant documentation with the code change.
