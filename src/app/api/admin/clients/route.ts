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
        const clients = await prisma.client.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                developers: {
                    select: { email: true }
                }
            }
        });
        return NextResponse.json(clients);
    } catch (error) {
        console.error("Failed to fetch clients", error);
        return new Response("Failed to fetch clients", { status: 500 });
    }
}

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session");

    if (!adminSession) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const { name, contactName, email, mobile, startDate, endDate, developerIds, totalBudget, amountPaid } = await req.json();

        if (!name) {
            return new Response("Name is required", { status: 400 });
        }

        // Generate RED-XXXX ID
        let uniqueId = "";
        let isUnique = false;

        while (!isUnique) {
            const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digit number
            uniqueId = `RED-${randomDigits}`;

            const existing = await prisma.client.findUnique({
                where: { id: uniqueId }
            });

            if (!existing) {
                isUnique = true;
            }
        }

        const client = await prisma.client.create({
            data: {
                id: uniqueId,
                name,
                contactName,
                email,
                mobile,
                totalBudget,
                amountPaid,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                developers: developerIds && developerIds.length > 0 ? {
                    connect: developerIds.map((id: string) => ({ id }))
                } : undefined
            },
        });

        return NextResponse.json(client);
    } catch (error) {
        console.error("Client creation error:", error);
        return new Response("Failed to create client", { status: 500 });
    }
}

export async function PUT(req: Request) {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session");

    if (!adminSession) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const { id, newId, name, contactName, email, mobile, totalBudget, amountPaid, startDate, endDate, developerIds } = await req.json();

        // If newId is provided and different from id, check uniqueness
        if (newId && newId !== id) {
            const existing = await prisma.client.findUnique({
                where: { id: newId }
            });
            if (existing) {
                return new Response("Client ID already exists", { status: 409 });
            }
        }

        // First disconnect all
        await prisma.client.update({
            where: { id },
            data: {
                developers: {
                    set: []
                }
            }
        });

        const client = await prisma.client.update({
            where: { id },
            data: {
                id: newId || undefined, // Update ID if provided
                name,
                contactName,
                email,
                mobile,
                totalBudget,
                amountPaid,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                developers: developerIds && developerIds.length > 0 ? {
                    connect: developerIds.map((id: string) => ({ id }))
                } : undefined
            }
        });

        return NextResponse.json(client);
    } catch (error) {
        console.error("Client update error:", error);
        return new Response("Failed to update client", { status: 500 });
    }
}
