import { prisma } from "@/lib/prisma";
import { createClientSession } from "@/lib/session";

export async function POST(req: Request) {
    const { clientId } = await req.json();

    if (!clientId) {
        return new Response("Client ID required", { status: 400 });
    }

    const normalizedId = clientId.trim().toUpperCase();
    console.log(`[Login Attempt] Original: "${clientId}", Normalized: "${normalizedId}"`);

    const client = await prisma.client.findUnique({
        where: { id: normalizedId },
    });

    if (!client) {
        console.warn(`[Login Failed] No client found for ID: ${normalizedId}`);
        return new Response("Invalid Client ID", { status: 401 });
    }

    console.log(`[Login Success] Client found: ${client.name} (${client.id})`);

    const headers = new Headers();
    headers.append("Set-Cookie", createClientSession(client.id));

    return new Response(
        JSON.stringify({ success: true }),
        { headers }
    );
}
