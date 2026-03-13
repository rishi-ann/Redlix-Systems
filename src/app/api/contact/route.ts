import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, email, subject, message } = await req.json();

        if (!name || !email || !subject || !message) {
            return new Response("Missing required fields", { status: 400 });
        }

        const inquiry = await prisma.contactInquiry.create({
            data: {
                name,
                email,
                subject,
                message,
            },
        });

        return NextResponse.json({ success: true, id: inquiry.id });
    } catch (error) {
        console.error("Contact Form Submission Error:", error);
        return new Response("Failed to submit inquiry", { status: 500 });
    }
}
