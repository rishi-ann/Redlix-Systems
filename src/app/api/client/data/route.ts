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
        // In a real app with proper session management, we'd decode the cookie or session ID.
        // Since our simple session is just "true" or similar for now, we might need a way to identify the client.
        // However, based on previous login implementation, we might have stored the ID in the cookie or need to relies on the client sending it?
        // Let's check how login was implemented. 
        // REVIEW: The client_session logic in `src/lib/session.ts` and `src/app/api/client/login/route.ts`.
        // The login route sets `client_session` to the `clientId`. 

        const clientId = clientSession.value;

        const client = await prisma.client.findUnique({
            where: { id: clientId },
            include: {
                developers: {
                    select: {
                        id: true,
                        email: true,
                    }
                }
            }
        });

        if (!client) {
            return new Response("Client not found", { status: 404 });
        }

        return NextResponse.json(client);
    } catch (error) {
        console.error("Failed to fetch client data:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
