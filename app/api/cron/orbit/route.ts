import { NextRequest, NextResponse } from "next/server";
import { runOrbit } from "@/lib/orbit/run";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

/**
 * Daily automation entry point.
 *
 * Vercel Cron sends `Authorization: Bearer $CRON_SECRET` on its own; other
 * schedulers (cron-job.org, GitHub Actions, a VPS crontab) can pass the same
 * value as `?secret=`. Without CRON_SECRET set the endpoint stays closed.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured on the server." },
      { status: 503 }
    );
  }

  const header = request.headers.get("authorization");
  const fromQuery = request.nextUrl.searchParams.get("secret");
  const authorized = header === `Bearer ${secret}` || fromQuery === secret;

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runOrbit({ trigger: "cron" });

  // A failed run still returns 200 so the scheduler does not retry-storm; the
  // failure is recorded in the Orbit run log either way.
  return NextResponse.json(result);
}
