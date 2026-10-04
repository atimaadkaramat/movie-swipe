# Recommendation Engine

## Goal
Produce useful personalized movie recommendations while keeping the initial implementation simple and free.

## Stage 1 — Rule-based
Signals include preferred/liked/passed genres, actors, directors, ratings, recent behavior, popularity and recency.

Conceptual score:
score = genre affinity + actor affinity + director affinity + rating signal + recency + popularity - negative preference.

## Stage 2 — Collaborative
Find users with similar movie behavior and use their positive signals for candidate generation.

## Stage 3 — Hybrid
Combine content signals, collaborative signals, recency, popularity among similar users, diversity and novelty.

## Explainability
Eventually support explanations such as “Because you liked X” and “Popular with people who share your taste.”

## Constraints
Do not introduce paid AI APIs or vector infrastructure for the MVP.
