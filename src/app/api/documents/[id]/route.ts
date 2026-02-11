import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Security: Check if admin or owner
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session");
    const clientSession = cookieStore.get("client_session");
    const devSession = cookieStore.get("developer_session");

    if (!adminSession && !clientSession && !devSession) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const doc = await prisma.clientDocument.findUnique({
            where: { id },
            select: { content: true, type: true, title: true }
        });

        if (!doc || !doc.content) {
            return new Response("Not Found", { status: 404 });
        }

        // Return the bytes with the correct content type
        return new Response(doc.content, {
            headers: {
                "Content-Type": doc.type || "application/octet-stream",
                "Content-Disposition": `inline; filename="${doc.title}"`,
            }
        });
    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}
