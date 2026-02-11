import { clearDevSession } from "@/lib/session";

export async function POST() {
    const headers = new Headers();
    headers.append("Set-Cookie", clearDevSession());

    return new Response(
        JSON.stringify({ success: true }),
        { headers }
    );
}
