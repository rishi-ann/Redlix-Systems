import { clearClientSession } from "@/lib/session";

export async function POST() {
    const headers = new Headers();
    headers.append("Set-Cookie", clearClientSession());

    return new Response(
        JSON.stringify({ success: true }),
        { headers }
    );
}
