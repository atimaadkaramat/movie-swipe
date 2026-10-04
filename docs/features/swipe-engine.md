# Swipe Engine

## Purpose
The swipe engine is the core MovieSwipe interaction.

## Actions
Right swipe = Like.
Left swipe = Pass.
Save = Wishlist.
Tap = Movie details.

## Data
movie_actions: id, user_id, movie_id, action, created_at.

## Discovery queue
Avoid recently processed movies, respect preference signals, support pagination, handle failures gracefully and keep transitions smooth.

## Future signals
Actions influence taste profile, recommendation score, Movie Twin and social compatibility.
