import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session");

    if (!adminSession) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const reports = await prisma.projectReport.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                client: {
                    select: { name: true }
                },
                developer: {
                    select: { email: true }
                }
            }
        });
        return NextResponse.json(reports);
    } catch (error) {
        return new Response("Failed to fetch reports", { status: 500 });
    }
}
