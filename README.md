# AI Event Concierge

Small full-stack app for planning corporate offsites using AI-generated venue proposals.

## What it does

- Takes a natural language event request
- Calls Gemini to generate a structured venue proposal
- Saves each request + result in MongoDB
- Shows current result and previous searches
- Supports pagination for viewing previous searches

## Tech

- Next.js (App Router)
- MongoDB + Mongoose
- Gemini API
- Tailwind CSS

## Run locally

1. Install deps:

   `npm install`

2. Create `.env.local` in project root:

   `MONGODB_URI=your_mongodb_connection_string`

   `GEMINI_API_KEY=gemini_api_key`

3. Start dev server:

   `npm run dev`

4. Open:

   `http://localhost:3000`

## API

- `POST /api/ai` → generate and save proposal
- `GET /api/ai?page=1&limit=5` → fetch proposal history

## Environment Variables

Create `.env.local` for local development:

```
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

## Deployment on Vercel

**Live URL:** https://ai-event-concierge-xi.vercel.app

**GitHub Repo**: [github.com/pratyushranjn/ai-event-concierge](https://github.com/pratyushranjn/ai-event-concierge)
