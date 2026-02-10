import { prisma } from "@/lib/prisma";
import { createClientSession } from "@/lib/session";

export async function POST(req: Request) {
    const { clientId } = await req.json();

    if (!clientId) {
        return new Response("Client ID required", { status: 400 });
    }

    const client = await prisma.client.findUnique({
        where: { id: clientId },
    });

    if (!client) {
        return new Response("Invalid Client ID", { status: 401 });
    }

    const headers = new Headers();
    headers.append("Set-Cookie", createClientSession(client.id));

    return new Response(
        JSON.stringify({ success: true }),
        { headers }
    );
}
