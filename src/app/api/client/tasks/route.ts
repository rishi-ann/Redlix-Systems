import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const clientSession = cookieStore.get("client_session");

    if (!clientSession) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const tasks = await prisma.task.findMany({
            where: { clientId: clientSession.value },
            orderBy: { createdAt: "desc" },
            include: {
                developer: {
                    select: {
                        email: true
                    }
                }
            }
        });
        return NextResponse.json(tasks);
    } catch (error) {
        return new Response("Failed to fetch tasks", { status: 500 });
    }
}
