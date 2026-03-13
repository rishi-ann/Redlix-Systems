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
        const docs = await prisma.clientDocument.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                client: {
                    select: { name: true, developers: { select: { id: true, email: true } } }
                }
            }
        });
        return NextResponse.json(docs);
    } catch (error) {
        return new Response("Failed to fetch documents", { status: 500 });
    }
}
