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
        const requests = await prisma.projectRequest.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(requests);
    } catch (error) {
        return new Response("Failed to fetch requests", { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session");

    if (!adminSession) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const { id, status } = await req.json();

        const updated = await prisma.projectRequest.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(updated);
    } catch (error) {
        return new Response("Failed to update status", { status: 500 });
    }
}
