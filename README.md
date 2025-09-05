This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Variables

Create a `.env.local` file in the project root with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Restart the dev server after adding env vars.

## Project Overview

Polling app built with Next.js App Router, Supabase (DB + Auth + Realtime), Tailwind + Shadcn UI. Users can register/sign in, create polls, view a dashboard, open a poll detail page, and vote. Mutations use Server Actions; data fetching is done in Server Components.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn-style components in `components/ui`
- **Backend**: Supabase (Postgres, Auth, RLS)

## Directory Structure (key folders)

- `app/` routes
  - `(auth)/sign-in`, `(auth)/sign-up`: auth pages
  - `(polls)/layout.tsx`: SSR auth guard for polls
  - `(polls)/polls/page.tsx`: dashboard – lists polls from DB, owner can Edit/Delete
  - `(polls)/polls/new/page.tsx`: create poll form
  - `(polls)/polls/new/actions.ts`: re-exports `createPoll` Server Action
  - `(polls)/polls/actions.ts`: re-exports `deletePoll` Server Action
  - `(polls)/polls/[id]/page.tsx`: poll detail – fetches poll + options; vote form
  - `(polls)/polls/[id]/vote.ts`: Server Action `submitVote`
- `components/ui/*`: Shadcn-style primitives (button, input, card, etc.)
- `components/forms/*`: `SignInForm`, `SignUpForm`, `PollForm`
- `components/auth/AuthProvider.tsx`: client auth context (user + methods)
- `lib/supabase/*`: SSR and browser Supabase client helpers
- `lib/polls/poll-actions.ts`: centralized poll actions (create/delete) + validation
- `supabase/migrations/0001_create_polls_votes.sql`: schema and RLS

## Database & Migrations

- Core tables: `polls`, `poll_options`, `votes`
- RLS enabled with policies; a trigger prevents duplicate votes in single-choice polls
- Apply schema using the SQL under `supabase/migrations/0001_create_polls_votes.sql`

## Implemented Features

- **Auth**
  - Supabase auth wired via SSR client and `AuthProvider`
  - `(polls)/layout.tsx` redirects unauthenticated users to `/sign-in`
  - Auth pages redirect to `/polls` if already signed in
- **Create Poll**
  - Form: `components/forms/PollForm.tsx`
  - Server Action: `lib/polls/poll-actions.ts#createPoll` (re-exported by `app/(polls)/polls/new/actions.ts`)
  - Validates question and at least two options
  - Redirects to `/polls?created=1` with success banner
- **Dashboard**
  - `app/(polls)/polls/page.tsx` fetches polls (SSR) and shows banners for created/deleted
  - Shows Edit/Delete for polls owned by current user
  - Delete via `lib/polls/poll-actions.ts#deletePoll` (re-exported by `app/(polls)/polls/actions.ts`)
- **Poll Detail & Voting**
  - `app/(polls)/polls/[id]/page.tsx` fetches poll + options from Supabase
  - Voting form posts to `app/(polls)/polls/[id]/vote.ts#submitVote`
  - Redirects back with `?voted=1` and shows a thank-you banner

## How to Run Locally

1. Set Node.js to 20+ (recommended)
2. Install deps: `npm i`
3. Add `.env.local` with Supabase project URL and anon key
4. Apply DB schema in Supabase using the provided migration SQL
5. Run: `npm run dev` and visit `/sign-up`, `/polls`, `/polls/new`, `/polls/[id]`

## Notes & Decisions

- Server Actions handle mutations (create poll, delete poll, vote)
- Server Components perform data fetching with the Supabase SSR client
- Root `/` redirects to `/polls`
- Success/notice banners use query flags (`?created=1`, `?deleted=1`, `?voted=1`)

## Security & Validation (follow-ups)

- Anonymous voting token: replace placeholder `voter_token = "guest"` with a random, HttpOnly cookie token minted server-side
- Tighten RLS: restrict raw `votes` visibility; expose only aggregate counts
- Add rate limiting for vote/create/delete actions
- Strengthen validation: max lengths, dedupe options, limit options count, verify `option_id` belongs to `poll_id`
- Use a transaction (SQL function) to create poll + options atomically

## Next Steps

- Show live vote counts (subscribe to Realtime or query aggregates)
- Implement edit poll page and update logic
- Add QR code share page for polls
- Add a simple navbar with sign-in/out and navigation

## Troubleshooting

- Cookie mutation error in SSR: only mutate cookies inside Server Actions or Route Handlers; SSR helper ignores mutations
- Node 18 deprecation warnings from Supabase SDK: upgrade to Node 20+
- Next 15 dynamic API: `searchParams` must be awaited (already updated where used)
