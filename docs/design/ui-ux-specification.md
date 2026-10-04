# UI/UX Specification

## Design source of truth

The current Phase 1 visual source of truth is the approved CineSwipe concept in the Figma file:

- Figma file: `VDMQa4ddEGUKOmBKRdp6Ww`
- Primary reference frames:
  - Discover Swipe — `1:2`
  - Movie Details — `1:123`
  - Watchlist Library — `1:379`
  - Movie Twin Social — `1:655`
  - Profile Taste DNA — `1:912`

These frames define the visual language and information hierarchy. Implementation may simplify individual decorative details for performance, accessibility, and platform consistency, but must preserve the product identity and interaction model.

## Visual direction

CineSwipe uses a **cinematic social / premium futuristic** visual direction:

- Dark-first, movie-focused interface.
- Rich atmospheric backgrounds and restrained glow.
- Selective glass/blur surfaces for floating controls and contextual overlays.
- Strong movie-poster/backdrop presentation.
- High-contrast typography with clear editorial hierarchy.
- Rounded cards and controls, without making every element a pill.
- Visual richness should support the movie content rather than obscure it.
- Poster artwork is allowed to provide most of the screen's color.
- Avoid generic dashboard styling, excessive neon, excessive gradients, or decorative effects that compete with the movie.

The goal is **cinematic + social + tactile + premium**, not a literal copy of Tinder and not a generic streaming catalog.

## Primary navigation

The primary Android navigation is:

1. Discover
2. Social
3. Library
4. Profile

Secondary destinations include Movie Details, People Discovery, Movie Twin, Search, Notifications, and other contextual screens.

## Discover — signature experience

The Discover screen is the most important screen in CineSwipe.

The Movie Card is the primary interaction surface. The user should be able to make the primary decision through the card itself without a persistent action-button row.

### Four-direction swipe model

| Gesture | Meaning | Persistence |
|---|---|---|
| Swipe left | Pass / Dislike | Record a `pass` movie action |
| Swipe right | Like / Accept | Record a `like` movie action |
| Swipe up | Watchlist | Record a `wishlist` movie action |
| Swipe down | Details | Open Movie Details; do **not** create a preference action |

The four directions are product-defining behavior and must remain consistent across implementation.

### Swipe behavior

- The card follows the user's finger in real time.
- Horizontal movement produces restrained rotation.
- Vertical movement moves the card toward the corresponding destination.
- Contextual labels/icons become more visible as the drag distance increases.
- Crossing the configured threshold commits the action and transitions to the next movie.
- Releasing below the threshold returns the card to its original position.
- Haptics should reinforce committed gestures without becoming distracting.
- Undo is secondary and should not become a persistent primary action.
- The first-time experience may show a short gesture tutorial:
  - `← PASS`
  - `LIKE →`
  - `↑ WATCHLIST`
  - `↓ DETAILS`
  This guidance should disappear after the user understands the interaction.

### Gesture feedback

- Pass: X / neutral-to-red feedback.
- Like: heart / restrained red-pink feedback.
- Watchlist: bookmark / muted gold-amber feedback.
- Details: information / neutral blue feedback.

Feedback must be understandable without relying on color alone.

## Movie Card

The Movie Card should prioritize:

1. Poster/backdrop artwork.
2. Movie title.
3. Year and concise metadata.
4. Taste Match / compatibility when available.
5. Minimal contextual information needed to make a decision.

The card stack may show one active card and one or two subtle cards behind it.

## Movie Details

Movie Details is a richer editorial page opened by swiping down from Discover or by an explicit deep-dive interaction elsewhere.

It can include:

- Poster/backdrop.
- Title, year, runtime.
- Genres.
- Synopsis.
- Cast and director.
- Ratings.
- Taste Match.
- Similar movies.
- Social activity.
- Trailer where available and permitted.

Technical production metadata should be secondary. Items such as camera format, projection format, audio format, or detailed production equipment must not dominate the primary movie decision flow.

## Library

Library follows the approved Watchlist Library visual direction and supports:

- Liked.
- Watchlist.
- Watched.
- Rated.

Filters, sorting, and counts should be compact and contextual rather than visually dominating the page.

## Social and Movie Twin

The social system should feel native to CineSwipe rather than like a generic social feed.

Key concepts:

- Profiles communicate movie taste.
- Taste Match and compatibility are meaningful product signals.
- Movie Twin visually emphasizes the relationship between two users and their shared taste.
- Shared likes, dislikes, genres, and other overlap signals can be surfaced.
- Follow/unfollow is contextual.
- Privacy controls remain explicit.

## Profile / Taste DNA

The profile design uses a cinematic profile showcase followed by taste-oriented statistics and Taste DNA.

Useful profile information includes:

- Avatar and identity.
- Taste summary/bio.
- Liked, watchlist, and watched counts.
- Movie Twin compatibility where available.
- Genre/taste distribution.
- Favorite movies and relevant social signals.

The profile should communicate **who this person is through their movie taste**, not just provide account settings.

## Components

Reusable components should be built around:

- MovieCard / SwipeCard
- GestureHUD
- TasteMatch
- GlassSurface
- CinematicBackdrop
- MoviePoster
- Rating/Compatibility indicator
- ProfileHeader
- TasteDNA
- MovieTwinHero
- LibrarySegmentControl
- BottomNavigation
- ContextualActionDock
- EmptyState
- LoadingState
- ErrorState

Components should remain composable and avoid screen-specific duplication where practical.

## Motion and haptics

Motion should feel physical and responsive:

- Swipe cards interpolate directly from touch position.
- Card rotation is tied to horizontal displacement.
- Commit transitions are fast and decisive.
- Details transition should feel like entering a deeper layer rather than navigating to an unrelated page.
- Glass/blur effects should not animate excessively.
- Respect Android reduced-motion/accessibility preferences where practical.

## Accessibility

- Maintain accessible contrast.
- Do not encode action meaning through color alone.
- Provide accessible labels for gestures and controls.
- Maintain practical Android touch targets.
- Support dynamic text where it does not destroy the movie-card interaction.
- Provide alternative accessible controls for users who cannot perform swipe gestures, without allowing those controls to replace the primary visual interaction for typical users.
- Respect reduced-motion preferences where practical.

## Required states

Every major screen defines:

- Loading.
- Empty.
- Error.
- Success/content.

Discover additionally needs:

- No more recommendations.
- Gesture tutorial.
- Swipe commit feedback.
- Undo available/unavailable.
- Network failure with retry.

## Research note

Mobbin remains useful as mobile UX reference material, but the approved Figma concept is the current CineSwipe visual source of truth. Do not copy external products directly.
