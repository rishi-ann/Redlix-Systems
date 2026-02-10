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
        const developer = await prisma.developer.findUnique({
            where: {
                id: devSession.value
            },
            include: {
                _count: {
                    select: {
                        clients: true,
                        tasks: true,
                        reports: true
                    }
                }
            }
        });

        if (!developer) {
            return new Response("Developer not found", { status: 404 });
        }

        return NextResponse.json(developer);
    } catch (error) {
        console.error("Failed to fetch developer profile:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
