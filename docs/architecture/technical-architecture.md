# Technical Architecture

## Platform
Android-first mobile application.

## Client
Expo, React Native, TypeScript, Expo Router.

## Backend
Supabase PostgreSQL, Authentication, Realtime, Row Level Security, and Edge Functions only where justified.

## Movie data
TMDB API. Cache selected metadata in Supabase to reduce repeated external requests.

## Email
Resend.

## Analytics
PostHog later, after core functionality is stable.

## Development tools
GitHub, Replit, Mobbin, Context7.

## Deployment
Expo/EAS for Android builds. Vercel is optional for supporting web/server functionality; the Android app is not hosted on Vercel.

## Strict separation from Radix
MovieSwipe must not use the Radix Neon database, APIs, authentication, environment variables, domain, customer/employee data or application credentials.

MovieSwipe gets its own Supabase project and credentials.

## Security
Only client-safe Supabase credentials may be included in the Android client. Privileged service-role credentials remain server-side.
