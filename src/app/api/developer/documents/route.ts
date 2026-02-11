import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const devSession = cookieStore.get("developer_session");

    if (!devSession) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        // Fetch documents only for clients assigned to this developer
        const docs = await prisma.clientDocument.findMany({
            where: {
                client: {
                    developers: {
                        some: {
                            id: devSession.value
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            include: {
                client: {
                    select: { name: true }
                }
            }
        });
        return NextResponse.json(docs);
    } catch (error) {
        return new Response("Failed to fetch documents", { status: 500 });
    }
}
