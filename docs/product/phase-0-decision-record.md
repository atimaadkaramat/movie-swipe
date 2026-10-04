# CineSwipe — Phase 0 Decision Record

## Product identity
- **Name:** CineSwipe
- **Platform:** Android
- **Package ID:** `com.cineswipe.app`
- **Repository:** `atimaadkaramat/movie-swipe`

## Product direction
CineSwipe is an Android-first movie discovery and social recommendation application centered on swipe-based movie discovery.

Core loop:

`DISCOVER → SWIPE → LIKE/PASS/SAVE → WATCH → RATE → BETTER RECOMMENDATIONS → FIND SIMILAR PEOPLE → FOLLOW → DISCOVER THEIR MOVIES`

## MVP boundary
The MVP covers Phases 0–7:
1. Product & architecture
2. UI/UX
3. Android project/infrastructure
4. Authentication
5. TMDB movie data
6. Swipe engine
7. Library/movie pages

Social functionality begins after the MVP in Phase 8. Advanced recommendations begin in Phase 9.

## Infrastructure decisions
| Area | Decision |
|---|---|
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Realtime | Supabase Realtime when required |
| Supabase project | CineSwipe |
| Supabase project ID | `yenrcyropgbhwvluzplj` |
| Supabase organization | Atimaad Projects |
| Supabase region | `ap-south-1` |
| Movie metadata | TMDB API |
| Email | Resend |
| UI research | Mobbin |
| Development/prototyping | Replit |
| Source control | GitHub |
| Android build | Expo/EAS |
| Analytics | PostHog later |
| Cost strategy | Free-first |

## Hard environment boundary

CineSwipe is an independent product.

It must **never** use:
- Radix Automations Neon database
- Radix Automations API endpoints
- Radix Automations authentication
- Radix customer/employee data
- Radix production environment variables
- Radix service credentials

Only CineSwipe's own Supabase configuration belongs in this application.

Privileged Supabase service-role credentials must remain server-side and must never be bundled into the Android application.

## Phase 0 completion criteria

Phase 0 is complete because:
- Product name is locked.
- Android package ID is locked.
- MVP scope is defined.
- Independent Supabase project exists and is healthy.
- Architecture and environment boundaries are documented.
- Repository roadmap reflects the decisions.

**Phase 1 is now the active phase.**
