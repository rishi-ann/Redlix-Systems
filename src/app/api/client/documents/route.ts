import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const clientSession = cookieStore.get("client_session");

    if (!clientSession) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const { title, url, description } = await req.json();

        // Client ID is the session value
        const clientId = clientSession.value;

        const doc = await prisma.clientDocument.create({
            data: {
                clientId,
                title,
                url,
                description
            }
        });

        return NextResponse.json(doc);
    } catch (error) {
        console.error("Document upload error:", error);
        return new Response("Failed to upload document", { status: 500 });
    }
}

export async function GET(req: Request) {
    const cookieStore = await cookies();
    const clientSession = cookieStore.get("client_session");

    if (!clientSession) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const docs = await prisma.clientDocument.findMany({
            where: { clientId: clientSession.value },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(docs);
    } catch (error) {
        return new Response("Failed to fetch documents", { status: 500 });
    }
}
