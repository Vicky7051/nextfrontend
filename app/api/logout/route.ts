import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const data = await req.json();
    const response = NextResponse.json({
        message: "Logout",
        data
    });
    response.cookies.set("authTokenF", '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        path: "/",
        maxAge : 0
    });

    response.cookies.set("roleF", '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge : 0
    });

    return response;
}
