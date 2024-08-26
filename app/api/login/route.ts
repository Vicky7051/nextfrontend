import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const data = await req.json();
    const { authToken, role } = data;
    const response = NextResponse.json({
        message: "Hello",
        data
    });
    response.cookies.set("authTokenF", authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        path: "/",
        maxAge : 24 * 60 * 60 * 1000
    });

    response.cookies.set("roleF", role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge : 24 * 60 * 60 * 1000
    });

    return response;
}
