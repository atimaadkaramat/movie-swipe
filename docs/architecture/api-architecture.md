# API Architecture

Keep the initial architecture simple. Do not introduce a separate backend service without a concrete requirement.

## Client-to-Supabase
Use Supabase client APIs for authentication, user-owned data, safe database operations and realtime subscriptions.

## TMDB
Use appropriate server-side handling when a secret-bearing API credential is required.

## Server-side operations
Use Supabase Edge Functions or another server runtime only for trusted operations, secret-bearing calls, scheduled jobs or recommendation computation that should not run on-device.

## Rules
- Validate all user input.
- Authorize every protected operation.
- Never trust client-supplied user IDs for ownership decisions.
- Avoid exposing internal database details.
