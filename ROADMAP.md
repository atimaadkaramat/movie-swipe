# Movie Social App — Product Definition & Master Roadmap

> **Working product definition:** A Gen-Z social movie app where people swipe to discover movies, build their movie taste, connect with people who share it, and make plans to watch together — either at a cinema or as a movie night at home.

> **Internal shorthand:** “Tinder for movies.” This describes the swipe interaction, not the public positioning.

## Product thesis

The core loop is: **SWIPE → TASTE → CONNECT → PLAN → WATCH → RATE → REPEAT**.
The product combines four-direction movie discovery, Cinema DNA, taste-based social discovery, mutual-follow relationships, cinema dates, movie nights, and polls that can become real movie plans.

## Core swipe model
- ← Pass
- → Like
- ↑ Watchlist
- ↓ Details

## Social model
- Follow does not automatically grant private-plan access.
- Follow + follow back = Mutual connection.
- Mutuals are eligible for private movie invitations.
- Private plans default to selected people; mutuals/public visibility can be added later.
- The product is not a dating app. Movie dates can be romantic, friendly, social, or casual. Matching is based on movie taste.

## Movie Plan model
A Movie Plan is a first-class object, not merely a notification.

Every plan contains:
- Movie
- Type: cinema or movie_night
- Date
- Start time
- Location
- Optional meet point
- Creator
- Participants
- Participant response
- Plan status
- Optional lightweight coordination
- Created/updated timestamps

Participant responses: invited, going, maybe, declined.

### Cinema plan
Example: Interstellar — Saturday 7:30 PM — PVR INOX Jammu — Meet 7:10 PM at the main entrance.

### Movie Night
Same architecture, with a home/private viewing location.

### Poll → Plan
Create a poll such as “What should we watch Saturday?”, collect votes, choose the winner, then convert it into a plan with type, date, time, location, meet point and invitees.

## Core screens
1. Discover — personalized movie cards, four-direction swipe, match percentage, search and discovery.
2. Movie Details — poster, backdrop, title, year, genres, synopsis, cast/crew, rating, similar movies, actions, watched/rating and Plan this movie.
3. Plans — upcoming plans, invitations, polls and past plans.
4. Plan Details — movie, plan type, date, time, location, meet point, participants, map, coordination, change/cancel.
5. Activity — follows, mutuals, invitations, poll activity, plan responses and taste-match events.
6. Library — saved, liked, passed, watched and rated.
7. Me/Profile — profile, Cinema DNA, watched/rated counts, followers/following, Taste Twins, activity and settings.
8. Other User Profile — Cinema DNA, compatibility, shared favorites, privacy-controlled activity, follow/unfollow and Plan Movie when permitted.

## Gen-Z product direction
- Visual-first and fast.
- Taste is identity.
- Mood/vibe-based discovery.
- Casual, concise copy.
- Shareable taste-match and movie-plan cards.
- Cinematic dark UI.
- Selective glass elements.
- Strong poster imagery.
- Subtle motion and haptics.
- One recognizable accent instead of rainbow/neon overload.
- Social planning should feel lightweight, not corporate.
- Avoid excessive slang, childish UI, endless animations and fake engagement metrics.

## Product differentiation
The differentiating loop is: **Movie discovery → taste identity → taste-compatible people → real-world movie plan**.
The goal is to move naturally from “I like this movie” to “Who else likes movies like me?” to “Want to watch this together?”
Movie Plans are the strongest social feature; Cinema DNA and Taste Matching are the connection layer.

## Complete development roadmap

### Phase 0 — Product & Architecture
- [ ] Finalize replacement brand/name.
- [x] Android-first direction.
- [x] Dedicated Supabase project.
- [x] Free-first architecture.
- [x] GitHub as source of truth.
- [x] Four-direction swipe model.
- [x] Product definition and social-planning model.
- [ ] Finalize privacy model.
- [ ] Finalize plan/poll data model.
Exit: requirements, identity, privacy boundaries and core architecture approved.

### Phase 1 — UI/UX Design
- [x] Core visual direction.
- [x] Discover, Movie Details, Library and social/profile concepts.
- [ ] Redesign around final product definition.
- [ ] Plans and Plan Details.
- [ ] Polls.
- [ ] Activity/Notifications.
- [ ] Gen-Z design language.
- [ ] Loading/error/empty states.
- [ ] Accessibility and touch targets.
Exit: Figma is the visual source of truth.

### Phase 2 — Project & Infrastructure
- [x] Expo + React Native + TypeScript foundation.
- [x] Android application ID foundation.
- [x] Expo Router.
- [x] Supabase client.
- [x] TMDB integration boundary.
- [x] Local fallback architecture.
- [ ] Production API proxy architecture.
- [ ] Push notification infrastructure.
Exit: infrastructure is stable and separated from unrelated projects.

### Phase 3 — Authentication & Profiles
- [x] Sign up, login, session persistence, logout and password recovery.
- [x] Email verification/deep-link foundation.
- [x] Profile creation/onboarding and RLS.
- [ ] Complete physical Android verification of email/deep-link/password recovery.
- [ ] Final profile UI.
Exit: authentication and onboarding work end-to-end on Android.

### Phase 4 — Movie Data
- [x] TMDB, discover, trending/popular, search, genres.
- [x] Movie details, cast/crew, similar movies and pagination.
- [ ] Selective/persistent metadata caching.
- [ ] Server-side protection for privileged TMDB access.
Exit: movie data is reliable, efficient and production-safe.

### Phase 5 — Swipe Engine
- [x] Right = Like; Left = Pass; Up = Watchlist; Down = Details.
- [x] Authenticated persistence and duplicate/conflict prevention.
- [x] Paginated discovery queue.
- [ ] Undo.
- [ ] Swipe animations.
- [ ] Haptics.
- [ ] Optimize taste-state reads.
Exit: discovery is fast, tactile and persistent.

### Phase 6 — Library
- [x] Saved/watchlist, liked, passed, watched, rated and filters.
- [ ] Sorting.
- [ ] Pagination for large libraries.
- [ ] Collections/lists later.
Exit: complete movie history is manageable.

### Phase 7 — Movie Pages
- [x] Poster/backdrop, title/year, genres, synopsis, cast/crew, similar movies.
- [x] Like/Pass/Save, watched and rating.
- [ ] Trailer where permitted.
- [ ] Compatibility/taste explanation.
- [ ] Plan this movie.
Exit: a movie page supports discovery, decision and social planning.

### Phase 8 — Social Graph
- [ ] User profiles.
- [ ] Follow/unfollow.
- [ ] Followers/following.
- [ ] Mutual connections.
- [ ] Taste visibility/privacy.
- [ ] Friends' relevant movie activity.
- [ ] Activity/following feeds.
- [ ] User discovery.
Exit: users can safely discover and connect with movie fans.

### Phase 9 — Taste & Recommendation Engine
- [ ] Genre, actor, director, like/pass, watchlist, watched, rating, recency and popularity signals.
- [ ] Collaborative filtering.
- [ ] Hybrid ranking with novelty/diversity.
- [ ] Recommendation explanations.
- [ ] Why this movie?
Exit: recommendations improve as users interact.

### Phase 10 — Cinema DNA & Taste Matching
- [ ] Taste profile generation.
- [ ] Visual taste categories.
- [ ] Compatibility percentage.
- [ ] Shared favorites.
- [ ] Taste Twins.
- [ ] Taste-based user discovery.
- [ ] Privacy controls.
- [ ] Shareable taste cards.
Exit: users can understand and compare movie taste.

### Phase 11 — Movie Plans
- [ ] Create plan.
- [ ] Cinema plan.
- [ ] Movie Night plan.
- [ ] Date and start time.
- [ ] Location and meet point.
- [ ] Select invitees.
- [ ] Mutuals-only eligibility for private plans.
- [ ] Accept / Maybe / Decline.
- [ ] Participant status.
- [ ] Plan Details.
- [ ] Map/deep-link to location.
- [ ] Plan updates.
- [ ] Cancel/change plan.
- [ ] Lightweight plan coordination/chat.
- [ ] Plan history.
Exit: a movie becomes a clear, actionable real-world plan.

### Phase 12 — Polls
- [ ] Create movie poll.
- [ ] Select recipients.
- [ ] Movie options.
- [ ] Vote.
- [ ] Results.
- [ ] Poll closing and winner.
- [ ] Convert poll → movie plan.
- [ ] Privacy controls.
Exit: groups can choose a movie and immediately create a plan.

### Phase 13 — Notifications
- [ ] Follow and mutual notifications.
- [ ] Movie invitation.
- [ ] Plan accepted/maybe/declined.
- [ ] Poll created/result.
- [ ] Plan updated/cancelled.
- [ ] Upcoming-plan reminder.
- [ ] Push preferences.
Exit: notifications are timely and user-controlled.

### Phase 14 — Reviews, Ratings & Lists
- [x] 1–10 rating foundation.
- [ ] Reviews.
- [ ] Spoiler marking.
- [ ] Comments.
- [ ] Public/private lists.
- [ ] List sharing.
- [ ] Shareable review/taste cards.
Exit: users can express and share meaningful movie opinions.

### Phase 15 — Advanced Discovery
- [ ] What should I watch?
- [ ] Mood/vibe discovery.
- [ ] Runtime filters.
- [ ] Trending among similar users.
- [ ] Hidden gems.
- [ ] Because you liked X.
- [ ] Similar to favorite.
- [ ] New releases.
- [ ] Streaming availability.
- [ ] Watch-now integrations where legally supported.
Exit: the app answers both “what fits me?” and “what should I watch tonight?”

### Phase 16 — Analytics
- [ ] Funnel analytics.
- [ ] Retention.
- [ ] Swipe/recommendation quality.
- [ ] Social conversion.
- [ ] Plan creation and acceptance.
- [ ] Poll conversion.
- [ ] Privacy-conscious analytics.
Exit: product decisions can be made from meaningful usage data.

### Phase 17 — Security & Performance
- [ ] Full RLS audit.
- [ ] Auth/session audit.
- [ ] Input validation.
- [ ] API protection and rate limiting where required.
- [ ] No service-role secrets in Android.
- [ ] Production TMDB/API proxy.
- [ ] Privacy review.
- [ ] Abuse/spam controls.
- [ ] Image caching and efficient queries.
- [x] Pagination.
- [ ] Swipe/startup performance.
- [ ] Offline-friendly behavior where useful.
Exit: no known critical security issue and core interactions are smooth.

### Phase 18 — Android Release
- [ ] Final brand/name.
- [ ] App icon and splash.
- [ ] Production environment.
- [ ] Signing.
- [ ] EAS production build.
- [ ] APK testing.
- [ ] AAB generation.
- [ ] Play Store listing.
- [ ] Privacy policy.
- [ ] Closed testing.
- [ ] Production release.
Exit: production Android build is stable and ready for Google Play.

### Phase 19 — Post-launch
- [ ] Crash/error monitoring.
- [ ] Retention analysis.
- [ ] Recommendation improvements.
- [ ] Onboarding improvements.
- [ ] Swipe-quality improvements.
- [ ] Social safety/abuse improvements.
- [ ] Feature request prioritization.
- [ ] Free-tier optimization.
- [ ] Community growth.
- [ ] Partnerships/integrations.

## Current implementation status
Already substantially implemented: Supabase auth/profile foundation, TMDB, Discover, four-direction swipe, action persistence, watched history, ratings, movie details, cast/crew, similar movies and Library.

Before major new feature work:
1. Resolve the SDK 54 Android/Expo Go dependency compatibility issue.
2. Test the current app on physical Android.
3. Fix regressions.
4. Finalize the replacement brand/name.
5. Redesign against this product definition.

## MVP definition
Foundation MVP: Phases 0–7.
Social MVP: Phase 8 plus the minimum of Phase 10.
Real-world social MVP: Phase 11.
Collaborative planning MVP: Phases 12–13.
The product should not be considered fully differentiated until **Swipe → Taste → Connect → Plan → Watch** works end-to-end.

## Future streaming/watch integration
A user-provided movie/streaming API can be integrated if its owner and terms permit the intended use, and if lawful playback/redistribution rights exist where applicable.

Possible integrations:
- Watch Now on Movie Details.
- Streaming-provider availability.
- Deep-link to an authorized provider.
- In-app playback only if the service explicitly grants playback rights and supports Android playback.

Never expose a private API key or privileged secret directly in the Android client. Privileged APIs should sit behind a secure server-side proxy.

## Phase gate rule
A phase is complete only when implementation works, documented requirements are satisfied, Android testing is performed, no critical regression exists, and documentation is updated.

## Persistence architecture
- [x] Separate movie preference actions from watch history.
- [x] Separate movie ratings from preference actions.
- [x] Persist watched state and ratings in Supabase with per-user RLS.
- [ ] Later: timestamp-based local/remote reconciliation for multi-device conflicts.