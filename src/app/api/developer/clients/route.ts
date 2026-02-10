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
        // Fetch clients assigned to this developer
        // The devSession.value contains the developer's ID
        const clients = await prisma.client.findMany({
            where: {
                developers: {
                    some: {
                        id: devSession.value
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                name: true,
                contactName: true,
                email: true,
                mobile: true,
                startDate: true,
                endDate: true,
                totalBudget: true,
                amountPaid: true,
                createdAt: true
            }
        });

        return NextResponse.json(clients);
    } catch (error) {
        console.error("Failed to fetch assigned clients:", error);
        return new Response("Failed to fetch clients", { status: 500 });
    }
}
