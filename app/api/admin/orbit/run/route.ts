import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { runOrbit } from "@/lib/orbit/run";

// Writing a full article takes well over the default function timeout.
export const maxDuration = 300;
export const dynamic = "force-dynamic";

/** "Run Now" from the Orbit panel: ignores the enabled flag and the daily guard. */
export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await runOrbit({ trigger: "manual", force: true });

    return NextResponse.json(result, {
      status: result.status === "failed" ? 500 : 200,
    });
  } catch (error: any) {
    console.error("Error running Orbit:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
