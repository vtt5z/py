# HARON OS

A premium AI-powered digital operating system experience built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion, GSAP, Three.js, Lenis, shadcn-style primitives, OpenAI-ready API routes, and Supabase-ready services.

## Features

- Cinematic HARON OS landing experience
- Streaming AI chat assistant
- PDF AI summarizer API route
- Screenshot analyzer API route
- Resume builder and writing assistant
- Developer tools: JSON formatter, regex tester, SQL generator, API tester, code explainer, error debugger
- Student hub: PDF notes, quizzes, flashcards, presentation flow, study assistant
- Ctrl+K command palette
- AI terminal mode
- Supabase client scaffolding for auth/storage
- Usage-limit middleware helpers

## Environment

Copy `.env.local.example` to `.env.local` and add keys:

```bash
OPENAI_API_KEY=your_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

`SUPABASE_SERVICE_ROLE_KEY` can also be added for server-side storage uploads.

Without `OPENAI_API_KEY`, AI routes return polished local demo responses so the interface remains testable.

## Getting Started

Run the development server:

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
