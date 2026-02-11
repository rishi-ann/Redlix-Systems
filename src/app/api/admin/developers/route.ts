import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const developers = await prisma.developer.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(developers);
    } catch (error) {
        return new Response("Failed to fetch developers", { status: 500 });
    }
}
