# User Flows

## New user

Open app → onboarding → create account → verify email → choose preferences → Discover.

## Returning user

Open app → restore session → Discover.

## Movie discovery

Discover → Movie Card → four-direction swipe interaction.

### Four-direction decision flow

- Swipe left → **Pass** → persist `pass` action → next movie.
- Swipe right → **Like** → persist `like` action → next movie.
- Swipe up → **Watchlist** → persist `wishlist` action → next movie.
- Swipe down → **Movie Details** → inspect movie without automatically creating a preference action → return to Discover.

The Discover experience should not depend on a permanent Like/Dislike/Watchlist button row. Swipe is the primary decision mechanism.

## Movie details

Movie Details → inspect poster/backdrop, title, metadata, synopsis, cast, ratings, Taste Match and similar/social information → return to Discover or continue to related movie content.

## Library

Library → Liked / Watchlist / Watched / Rated → filter/sort → Movie Details.

## Social

Social → activity from followed users → open profile or movie → inspect taste/compatibility → follow/unfollow → Movie Details.

## Movie Twin

People Discovery / Movie Twin → compare taste compatibility → inspect shared likes, genres and other overlap → follow user → explore their movie activity.

## Profile

Profile → Taste DNA → personal movie statistics → liked/watchlist/watched/rated content → privacy/account settings.

## Accessibility alternative

Users who cannot perform swipe gestures must have an accessible alternative path for the same actions. The alternative should preserve the four action semantics while keeping swipe as the primary interaction for typical users.

## Future social flow

Profile → Follow → Following feed → Movie activity → Movie Details → Like / Save / Discuss.
