import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return new Response("Missing fields", { status: 400 });
    }

    // Supabase signup
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error || !data.user) {
        return new Response(error?.message ?? "Signup failed", { status: 400 });
    }

    // Store developer profile in Prisma
    await prisma.developer.create({
        data: {
            id: data.user.id,
            email: data.user.email!,
        },
    });

    return Response.json({ success: true });
}
