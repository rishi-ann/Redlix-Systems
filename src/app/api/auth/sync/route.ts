import { createDevSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId, email } = await req.json();

        if (!userId || !email) {
            return new Response("Missing data", { status: 400 });
        }

        // Ensure developer exists in Prisma (Sync Supabase -> Prisma)
        await prisma.developer.upsert({
            where: { id: userId },
            update: { email },
            create: { id: userId, email },
        });

        const response = NextResponse.json({ success: true });

        // Set the developer session cookie for the middleware
        response.headers.append("Set-Cookie", createDevSession(userId));

        return response;
    } catch (error) {
        console.error("Sync API Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
