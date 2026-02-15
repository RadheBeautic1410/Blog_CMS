import { NextRequest, NextResponse } from "next/server";
import { login, getCurrentUser } from "@/lib/auth";

// Check if user is already authenticated
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (user) {
      return NextResponse.json(
        { authenticated: true, user },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await login(email, password);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Login successful", user: result.user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
