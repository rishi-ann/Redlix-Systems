import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { title, description, developerId, clientId } = await req.json();

        if (!title || !developerId || !clientId) {
            return new Response("Title, Developer ID, and Client ID required", { status: 400 });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                developerId,
                clientId
            },
        });

        return NextResponse.json(task);
    } catch (error) {
        return new Response("Failed to assign task", { status: 500 });
    }
}
