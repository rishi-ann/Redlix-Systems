import { createClient } from "@/lib/supabase/server";
import { createDevSession } from "@/lib/session";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return new Response("Missing fields", { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return new Response(error.message, { status: 401 });
    }

    const headers = new Headers();
    headers.append("Set-Cookie", createDevSession(data.user!.id));

    return new Response(
        JSON.stringify({ success: true }),
        { headers }
    );
}
