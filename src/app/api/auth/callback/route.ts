import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/developer";

    console.log("Auth Callback Params:", Object.fromEntries(searchParams.entries()));

    // If we have a code, try to handle it server-side (Standard PKCE)
    if (code) {
        try {
            const supabase = await createClient();
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);

            if (!error && data.user) {
                // Ensure developer profile exists in Prisma
                await prisma.developer.upsert({
                    where: { id: data.user.id },
                    update: { email: data.user.email! },
                    create: { id: data.user.id, email: data.user.email! },
                });

                const response = NextResponse.redirect(`${origin}${next}`);

                // Set the session cookie for existing middleware
                const { createDevSession } = await import("@/lib/session");
                response.headers.append("Set-Cookie", createDevSession(data.user.id));

                return response;
            }
            console.warn("Server-side exchange failed, falling back to handshake:", error?.message);
        } catch (err) {
            console.error("Server-side callback exception:", err);
        }
    }

    // Fallback: Redirect to client-side handshake
    // This catches fragment tokens (#access_token=...) which the server cannot see
    return NextResponse.redirect(`${origin}/auth/handshake`);
}
