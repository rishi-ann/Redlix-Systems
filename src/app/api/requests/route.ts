import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { clientName, clientEmail, projectTitle, description, budget } = await req.json();

        if (!clientName || !clientEmail || !projectTitle || !description) {
            return new Response("Missing required fields", { status: 400 });
        }


        const projectRequest = await prisma.projectRequest.create({
            data: {
                clientName,
                clientEmail,
                projectTitle,
                description,
                budget,
            },
        });

        return NextResponse.json({ success: true, id: projectRequest.id });
    } catch (error) {
        console.error("Project Request Submission Error:", error);
        return new Response("Failed to submit request", { status: 500 });
    }
}
