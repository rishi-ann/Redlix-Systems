import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isApi = path.startsWith("/api");

    const admin = req.cookies.get("admin_session");
    const dev = req.cookies.get("developer_session");
    const client = req.cookies.get("client_session");

    const unauthorizedResponse = () => {
        if (isApi) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (path.startsWith("/admin")) return NextResponse.redirect(new URL("/admin/login", req.url));
        if (path.startsWith("/developer")) return NextResponse.redirect(new URL("/developer/login", req.url));
        if (path.startsWith("/client")) return NextResponse.redirect(new URL("/client/login", req.url));
        return NextResponse.redirect(new URL("/", req.url));
    };

    // Admin protection
    if (
        (path.startsWith("/admin") || path.startsWith("/api/admin")) &&
        !path.startsWith("/admin/login") &&
        !path.startsWith("/api/admin/login") &&
        !admin
    ) {
        return unauthorizedResponse();
    }

    // Developer protection
    if (
        (path.startsWith("/developer") || path.startsWith("/api/developer")) &&
        !path.startsWith("/developer/login") &&
        !path.startsWith("/developer/signup") &&
        !path.startsWith("/api/developer/login") &&
        !path.startsWith("/api/developer/signup") &&
        !dev
    ) {
        return unauthorizedResponse();
    }

    // Client protection
    if (
        (path.startsWith("/client") || path.startsWith("/api/client")) &&
        !path.startsWith("/client/login") &&
        !path.startsWith("/api/client/login") &&
        !client
    ) {
        return unauthorizedResponse();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/developer/:path*",
        "/client/:path*",
        "/api/admin/:path*",
        "/api/developer/:path*",
        "/api/client/:path*"
    ],
};
