import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/", // 🟢 Ensure it's cleared site-wide
      sameSite: "strict", // 🟢 Match login cookie config
      secure: process.env.NODE_ENV === "production", // 🟢 Match login security
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
