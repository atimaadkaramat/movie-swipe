# CineSwipe Development Roadmap

Master roadmap for the Android movie-social application. This is the project's phase gate.

## Project constraints
1. Android-first.
2. Separate product from Radix Automations.
3. Dedicated Supabase project/database.
4. Never connect CineSwipe to the existing Radix Neon database.
5. Free-first architecture.
6. Never ship privileged secrets in the Android client.
7. This repository and its documentation are the source of truth.

## Phase 0 — Product & Architecture
Goal: freeze product direction and technical boundaries.
- [x] Confirm product name/branding — **CineSwipe**.
- [x] Define target audience — Android users who enjoy movie discovery and social recommendations.
- [x] Finalize MVP scope.
- [x] Finalize Android package/application ID — `com.cineswipe.app`.
- [x] Create dedicated Supabase project — **CineSwipe**, region `ap-south-1`.
- [x] Document environment separation.
- [x] Finalize architecture and initial data model.

### Phase 0 decisions
| Decision | Final choice |
|---|---|
| Product | CineSwipe |
| Platform | Android |
| Package ID | `com.cineswipe.app` |
| GitHub | `atimaadkaramat/movie-swipe` |
| Database/Auth | Dedicated Supabase project |
| Supabase project ID | `yenrcyropgbhwvluzplj` |
| Supabase region | `ap-south-1` |
| Movie metadata | TMDB |
| Email | Resend |
| UI research | Mobbin |
| Development/prototyping | Replit |
| Source of truth | GitHub repository |
| Cost policy | Free-first |
| Radix dependency | None |

**Environment boundary:** CineSwipe must not use Radix Automations credentials, APIs, Neon database, authentication, customer/employee data, or production environment variables.

Exit: product requirements and architecture approved; Supabase project is independent; no Radix dependency.

## Phase 1 — UI/UX Design
Goal: establish the mobile design system.
- [ ] Research mobile patterns with Mobbin. *(Blocked: Mobbin MCP requires a paid plan.)*
- [x] Define visual direction, typography, spacing, navigation.
- [x] Approve core screen designs: Discover, Movie Details, Library, Movie Twin/Social, Profile/Taste DNA.
- [x] Define loading/error/empty states.
- [x] Specify four-direction swipe animations and feedback.

Exit: approved Figma concept is the visual source of truth; implementation begins with Phase 2.

## Phase 2 — Project & Infrastructure

- [x] Create dedicated Android-first Expo + React Native + TypeScript foundation.
- [x] Set Android application ID to `com.cineswipe.app`.
- [x] Establish Expo Router navigation shell.
- [x] Add Discover, Social, Library, and Profile navigation surfaces.
- [x] Establish reusable cinematic design tokens.
- [x] Add local mock movie data and a functional four-direction swipe prototype.
- [ ] Connect the project to the GitHub development workflow and validate Android build.
- [ ] Configure Supabase client for the dedicated CineSwipe project without committing secrets.
- [ ] Configure TMDB integration boundary.


## Phase 3 — Authentication
- [ ] Sign up.
- [ ] Login.
- [ ] Email verification.
- [ ] Session persistence.
- [ ] Logout.
- [ ] Password recovery.
- [ ] Profile creation.
- [ ] Supabase Row Level Security.

Exit: secure registration and session flow works end-to-end.

## Phase 4 — TMDB Movie Data
- [ ] Configure TMDB API.
- [ ] Discovery, trending/popular, search.
- [ ] Genres.
- [ ] Movie details.
- [ ] Cast/crew.
- [ ] Similar movies.
- [ ] Selective metadata caching in Supabase.
- [ ] Pagination/caching.

Exit: real movie data renders reliably.

## Phase 5 — Swipe Engine
Goal: build the core CineSwipe interaction.
- [ ] Right swipe = Like.
- [ ] Left swipe = Pass.
- [ ] Save/Wishlist.
- [ ] Tap = Movie details.
- [ ] Undo where appropriate.
- [ ] Animation and haptics.
- [ ] Persist every action.
- [ ] Prevent duplicate/conflicting actions.
- [ ] Discovery queue.

Core action model:
movie_actions: id, user_id, movie_id, action, created_at.

Actions: like, pass, wishlist, watched.

Exit: open app → see movie → swipe → action persists → next movie appears.

## Phase 6 — Library
- [ ] Liked.
- [ ] Wishlist.
- [ ] Watched.
- [ ] Rated.
- [ ] Filters.
- [ ] Sorting.
- [ ] Pagination.

Exit: actions are correctly reflected in Library.

## Phase 7 — Movie Pages
- [ ] Poster/backdrop.
- [ ] Title/year/runtime.
- [ ] Genres.
- [ ] Synopsis.
- [ ] Cast.
- [ ] Trailer where permitted/available.
- [ ] Like/Pass/Wishlist controls.
- [ ] Similar movies.
- [ ] Social activity.
- [ ] Compatibility indicator when available.

Exit: movie pages give enough context to decide whether to watch/save/pass.

## Phase 8 — Social System
- [ ] User profiles.
- [ ] Follow/unfollow.
- [ ] Followers/following.
- [ ] Activity feed.
- [ ] Following feed.
- [ ] Friends' liked movies.
- [ ] Public taste information.
- [ ] Privacy controls.

Exit: users can follow people and see relevant movie activity.

## Phase 9 — Recommendation Engine
Stage 1: rule-based signals: genre, actor, director, ratings, recent behavior, passes, popularity and recency.

Stage 2: collaborative filtering using users with similar movie behavior.

Stage 3: hybrid content + collaborative + recency + diversity + novelty.

- [ ] Personalized candidate generation.
- [ ] Recommendation ranking.
- [ ] Recommendation explanations.

Exit: Discover is meaningfully personalized.

## Phase 10 — Movie Twin
- [ ] Taste similarity calculation.
- [ ] Compatibility percentage.
- [ ] Movie Twin discovery.
- [ ] Shared likes/dislikes.
- [ ] Privacy controls.

Exit: users can discover people with similar movie taste.

## Phase 11 — Reviews, Ratings & Lists
- [ ] 1–5 star ratings.
- [ ] Reviews.
- [ ] Spoiler marking.
- [ ] Comments.
- [ ] Public/private lists.
- [ ] List sharing.

Exit: users can create meaningful public movie content.

## Phase 12 — Advanced Discovery
- [ ] What should I watch?
- [ ] Mood-based discovery.
- [ ] Runtime filters.
- [ ] Trending among similar users.
- [ ] Hidden gems.
- [ ] Because you liked X.
- [ ] Similar to favorite movie.
- [ ] New releases.

Exit: multiple personalized discovery modes work.

## Phase 13 — Group Movie Night
- [ ] Create session.
- [ ] Invite friends.
- [ ] Independent swiping.
- [ ] Common-match ranking.
- [ ] Final movie selection.

Exit: a group can produce a shared shortlist.

## Phase 14 — Notifications
- [ ] Follow notifications.
- [ ] Social activity notifications.
- [ ] Review interactions.
- [ ] Movie Twin events.
- [ ] Recommendation notifications.
- [ ] Email where appropriate.
- [ ] Push preferences.

Exit: notifications are reliable and user-controlled.

## Phase 15 — Analytics
Use PostHog later and only within the free tier where practical.

Track: signup, onboarding_completed, movie_viewed, swipe_left, swipe_right, wishlist_added, movie_watched, movie_rated, follow_created, review_created, recommendation_clicked.

Exit: core product funnel is measurable without collecting unnecessary personal data.

## Phase 16 — Security & Performance
Security:
- [ ] RLS audit.
- [ ] Auth/session audit.
- [ ] Input validation.
- [ ] API protection.
- [ ] Rate limiting where required.
- [ ] No service-role secrets in Android.
- [ ] Secure session storage.
- [ ] Privacy review.

Performance:
- [ ] Image caching.
- [ ] Pagination.
- [ ] Efficient queries.
- [ ] Swipe animation performance.
- [ ] Startup performance.
- [ ] Offline-friendly behavior where useful.

Exit: no known critical security issue and smooth core interactions.

## Phase 17 — Android Release
- [ ] App icon.
- [ ] Splash screen.
- [ ] Production environment.
- [ ] App signing.
- [ ] EAS production build.
- [ ] APK testing.
- [ ] AAB generation.
- [ ] Play Store listing.
- [ ] Privacy policy.
- [ ] Closed testing.
- [ ] Production release.

Exit: production Android build is stable and ready for Google Play.

## Phase 18 — Post-launch
- [ ] Monitor crashes/errors.
- [ ] Analyze retention.
- [ ] Improve recommendations.
- [ ] Improve onboarding.
- [ ] Improve swipe quality.
- [ ] Prioritize feature requests.
- [ ] Optimize free-tier usage.

Future possibilities: AI recommendations, watch parties, chat, streaming availability, taste analytics, challenges, badges, leaderboards and creator lists.

## MVP definition
The first public-quality MVP is Phases 0–7.

Minimum loop:
Create account → onboarding → discover → swipe → like/pass/save → movie details → library.

Social features begin in Phase 8. Advanced recommendations begin in Phase 9.

## Phase gate rule
A phase is complete only when implementation works, documented requirements are satisfied, Android testing is done, no critical regression exists, and documentation is updated.
