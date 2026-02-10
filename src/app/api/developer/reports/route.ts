import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const devSession = cookieStore.get("developer_session");

    if (!devSession) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const { clientId, status, summary, documentUrl, issueType, issueDescription } = await req.json();

        // Verify the developer is assigned to this client
        const client = await prisma.client.findFirst({
            where: {
                id: clientId,
                developers: {
                    some: {
                        id: devSession.value
                    }
                }
            }
        });

        if (!client) {
            return new Response("Unauthorized: Client not assigned to you", { status: 403 });
        }

        const report = await prisma.projectReport.create({
            data: {
                clientId,
                developerId: devSession.value,
                status,
                summary,
                documentUrl: documentUrl || null,
                issueType: issueType || "NONE",
                issueDescription: issueDescription || null
            }
        });

        return NextResponse.json(report);
    } catch (error) {
        console.error("Report submission error:", error);
        return new Response("Failed to submit report", { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
        return new Response("Client ID required", { status: 400 });
    }

    try {
        const reports = await prisma.projectReport.findMany({
            where: { clientId },
            orderBy: { createdAt: "desc" },
            include: {
                developer: {
                    select: { email: true }
                }
            }
        });
        return NextResponse.json(reports);
    } catch (error) {
        return new Response("Failed to fetch reports", { status: 500 });
    }
}
