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
        const { title, size, type, description, content } = await req.json();

        if (!title || !content) {
            return new Response("Title and Content are required", { status: 400 });
        }

        // Client ID is the session value
        const clientId = clientSession.value;

        // Convert base64 to buffer
        const buffer = Buffer.from(content, 'base64');

        const doc = await prisma.clientDocument.create({
            data: {
                clientId,
                title,
                url: "#", // Placeholder as it's kept in DB
                size: size ? parseInt(size.toString()) : buffer.length,
                type,
                content: buffer,
                description
            }
        });

        // Update the URL to the internal download link
        const finalDoc = await prisma.clientDocument.update({
            where: { id: doc.id },
            data: { url: `/api/documents/${doc.id}` }
        });

        return NextResponse.json(finalDoc);
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
