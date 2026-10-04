# Swipe Engine

## Purpose
The swipe engine is the core CineSwipe interaction.

## Four-direction actions
- **Right swipe** = Like.
- **Left swipe** = Pass.
- **Up swipe** = Watchlist.
- **Down swipe** = Movie details.

There is no permanent Like/Pass button row on Discover. The gesture itself is the primary decision mechanism.

## Swipe feedback
- Right: heart confirmation.
- Left: cross confirmation.
- Up: bookmark confirmation.
- Down: details confirmation.
- Feedback is transient and does not block the next card.

## Local taste signals
During the offline-first foundation stage, swipe actions are stored locally with AsyncStorage:
- movie id
- action
- movie snapshot
- timestamp

These signals currently power the local Taste DNA profile.

## Watchlist
Watchlist selections are persisted locally and rendered in Library. Removing a title updates local storage.

## Future Supabase model
When authentication and Supabase persistence are introduced, the local action model maps to:

movie_actions: id, user_id, movie_id, action, created_at.

Actions: like, pass, watchlist, watched.

## Discovery queue
Avoid recently processed movies, respect preference signals, support pagination, handle failures gracefully and keep transitions smooth.

## Future signals
Actions will influence taste profile, recommendation score, Movie Twin and social compatibility.
