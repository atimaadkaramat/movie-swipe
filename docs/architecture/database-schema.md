# Database Schema

## profiles
id, username, display_name, avatar_url, bio, created_at, updated_at.

## movies
id, tmdb_id, title, overview, release_date, poster_path, backdrop_path, runtime, vote_average, original_language, metadata, created_at, updated_at.

## genres
id, tmdb_id, name.

## movie_genres
movie_id, genre_id.

## movie_actions
id, user_id, movie_id, action, created_at.

Actions: like, pass, wishlist, watched.

## ratings
id, user_id, movie_id, rating, created_at, updated_at.

## follows
follower_id, following_id, created_at.

## Future tables
reviews, comments, lists, list_movies, notifications, movie_recommendations, taste_profiles, recommendation_events, group_movie_sessions.

## Principles
- Explicit foreign keys.
- Unique constraints for duplicate relationships/actions where appropriate.
- Row Level Security required.
- User-owned data must not be readable/writable by unauthorized users.
