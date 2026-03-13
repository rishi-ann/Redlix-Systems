import { createAdminSession } from "@/lib/session";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    if (
        email !== process.env.ADMIN_EMAIL ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        return new Response("Invalid admin credentials", {
            status: 401,
        });
    }

    const headers = new Headers();
    headers.append("Set-Cookie", createAdminSession());

    return new Response(
        JSON.stringify({ success: true }),
        { headers }
    );
}
