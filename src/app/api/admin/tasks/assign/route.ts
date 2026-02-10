import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { title, description, developerId } = await req.json();

        if (!title || !developerId) {
            return new Response("Title and Developer ID required", { status: 400 });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                developerId,
            },
        });

        return NextResponse.json(task);
    } catch (error) {
        return new Response("Failed to assign task", { status: 500 });
    }
}
