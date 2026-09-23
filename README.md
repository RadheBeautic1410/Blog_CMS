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

## Orbit - daily automated blog posts

Orbit lives at `/admin/orbit`, behind the same admin login as the rest of the
panel. Twice a day it picks a topic, writes a full post with an LLM, attaches a
featured image from the Media Library, and saves it - as a draft by default, so
nothing reaches the site until you approve it.

### One-time setup

1. **Push the schema.** Orbit adds three collections (`orbit_settings`,
   `orbit_topics`, `orbit_runs`):

   ```bash
   npx prisma db push
   ```

2. **Add an API key.** The default provider is Google Gemini, whose free tier
   covers one post a day. Create a key at
   [aistudio.google.com/apikey](https://aistudio.google.com/apikey) and set:

   ```
   GEMINI_API_KEY=...
   ```

   To use a different writer, pick it in Orbit → Settings and set the matching
   variable instead: `GROQ_API_KEY`, `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`.

3. **Add a cron secret.** `CRON_SECRET` protects `/api/cron/orbit`; without it
   the endpoint returns 503 and the schedule never runs. Use any long random
   string, and set the same value in your Vercel project settings.

4. **Check the panel.** Orbit → Overview shows a setup checklist (API key,
   author, category, image, cron secret). Every item has to be green before the
   daily run will produce anything.

5. **Turn it on** in Orbit → Settings, and press **Run Now** once to confirm the
   whole path works end to end.

### Scheduling

`vercel.json` registers two daily crons - `30 2 * * *` and `30 12 * * *`, i.e.
**08:00 and 18:00 IST** - so two posts are written per day. Vercel sends
`Authorization: Bearer $CRON_SECRET` automatically. To schedule from somewhere
else instead (cron-job.org, GitHub Actions, a VPS crontab), call:

```
GET https://<your-domain>/api/cron/orbit?secret=<CRON_SECRET>
```

A successful run inside the last 6 hours makes the next cron hit a no-op, so a
repeated trigger cannot produce a duplicate. That window has to stay well under
the gap between the two scheduled runs (10 hours) - if you move the schedule
closer together, lower `DUPLICATE_WINDOW_HOURS` in `lib/orbit/run.ts` to match.
**Run Now** bypasses the guard on purpose.

On Vercel's Hobby plan, cron jobs are limited to two per project and fire
within about an hour of the scheduled time, which is fine for this. Exact timing
needs a Pro plan, or an external scheduler hitting the URL above.

### How a run works

`lib/orbit/run.ts` is the whole pipeline:

1. Take the oldest pending topic from the queue; if the queue is empty, ask the
   model for a fresh one (it sees the last 40 post titles so it avoids repeats).
2. Write the article as HTML, with the site tone, language and word count from
   settings, plus any house rules you added.
3. Sanitize the HTML (strips scripts, styles, iframes, inline handlers, and
   demotes any `<h1>` to `<h2>`).
4. Pick a featured image: a Media Library item whose name or alt text matches a
   keyword, else any library image, else the fallback URL from settings.
5. Create the post as a `draft` (or `published`, if you turn auto-publish on in
   settings - then it also bumps the category count and revalidates the public
   pages).
6. Record an `OrbitRun` row - visible under Orbit → Overview → Recent runs.

Failed runs leave their topic in the queue so the next run retries it; the error
is on the run log. A topic the model keeps failing on can be deleted from
Orbit → Topics.

### Cost

Gemini's free tier handles two posts a day comfortably. On the paid providers, a
~1200-word post costs roughly a few cents, so a few dollars a month at two posts
a day.
