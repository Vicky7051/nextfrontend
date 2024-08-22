import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ['/', '/users', '/approval', '/salary', '/logs'];

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    
    if (protectedRoutes.includes(pathname)) {
        // Check for the presence of a specific cookie (e.g., "auth-token")
        const token = req.cookies.get('authToken');
        const role = req.cookies.get('role')?.value;
        console.log("Token =>", token)
        // If the token is not present, redirect to the login page
        if(typeof role === "string"){
            if(["EMPLOYEE"].includes(role)){
                if(!["/", "/logs"].includes(pathname)){
                    return NextResponse.redirect(new URL('/', req.url));
                }
            }
            else if(["TEAM_LEADER"].includes(role)){
                if(!["/", "/users", '/salary', '/logs'].includes(pathname)){
                    return NextResponse.redirect(new URL('/', req.url));
                }
            }
            else if(["MANAGER"].includes(role)){
                if(!["/", "/users", "/approval", '/salary','/logs'].includes(pathname)){
                    return NextResponse.redirect(new URL('/', req.url));
                }
            }
        }
        
        if (!token) {
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }
    }
    return NextResponse.next();
}
