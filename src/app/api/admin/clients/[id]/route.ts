import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session");

    if (!adminSession) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const { id } = await params;
        const { name, contactName, email, mobile, startDate, endDate, totalBudget, amountPaid, developerIds } = await req.json();

        const data: any = {
            name,
            contactName,
            email,
            mobile,
            totalBudget,
            amountPaid,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
        };

        if (developerIds && Array.isArray(developerIds)) {
            data.developers = {
                set: developerIds.map((id: string) => ({ id }))
            };
        }

        const client = await prisma.client.update({
            where: { id },
            data,
        });

        return NextResponse.json(client);
    } catch (error) {
        console.error("Client update error:", error);
        return new Response("Failed to update client", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session");

    if (!adminSession) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const { id } = await params;

        await prisma.client.delete({
            where: { id },
        });

        return new Response(null, { status: 204 });
    } catch (error) {
        console.error("Client deletion error:", error);
        return new Response("Failed to delete client", { status: 500 });
    }
}
