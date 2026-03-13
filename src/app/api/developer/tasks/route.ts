import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const devSession = cookieStore.get("developer_session"); // Assuming we store dev ID here for simplicity in this demo, or we pull from supabase

    if (!devSession) {
        return new Response("Unauthorized", { status: 401 });
    }

    // In a real app, we'd verify the JWT or session properly. 
    // For now, we'll fetch all tasks or use a placeholder if we haven't linked real IDs yet.
    try {
        const tasks = await prisma.task.findMany({
            where: { developerId: devSession.value },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(tasks);
    } catch (error) {
        return new Response("Failed to fetch tasks", { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const cookieStore = await cookies();
    const devSession = cookieStore.get("developer_session");

    if (!devSession) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const { taskId, status } = await req.json();

        // Verify task belongs to developer
        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task || task.developerId !== devSession.value) {
            return new Response("Task not found or unauthorized", { status: 404 });
        }

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: { status },
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        return new Response("Failed to update task", { status: 500 });
    }
}
