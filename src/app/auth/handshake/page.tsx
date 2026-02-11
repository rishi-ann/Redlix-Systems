"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthHandshake() {
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const handleAuth = async () => {
            // Get the session - this works for both ?code= and #access_token= flows
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error("Handshake error:", error);
                router.push("/developer/login?error=handshake_failed");
                return;
            }

            if (session?.user) {
                try {
                    // Finalize the session on our backend (set cookies, sync Prisma)
                    const res = await fetch("/api/auth/sync", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            userId: session.user.id,
                            email: session.user.email
                        }),
                    });

                    if (res.ok) {
                        router.push("/developer");
                    } else {
                        router.push("/developer/login?error=sync_failed");
                    }
                } catch (syncError) {
                    console.error("Sync error:", syncError);
                    router.push("/developer/login?error=sync_exception");
                }
            } else {
                // If no session yet, we might still be initializing
                // but usually, if we reached here, something is wrong or we need to wait
                // We'll give it a tiny bit of time
                const timeout = setTimeout(() => {
                    router.push("/developer/login?error=no_session");
                }, 5000);
                return () => clearTimeout(timeout);
            }
        };

        handleAuth();
    }, [router, supabase]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 font-sans">
            <div className="text-center space-y-6 animate-in fade-in duration-700">
                <div className="relative">
                    <div className="h-12 w-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                    <div className="absolute inset-0 h-12 w-12 border-2 border-emerald-500/5 rounded-full mx-auto" />
                </div>
                <div className="space-y-2">
                    <p className="text-zinc-900 dark:text-zinc-100 text-sm font-medium uppercase tracking-[0.2em]">Synchronizing</p>
                    <p className="text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-widest animate-pulse">Establishing secure link...</p>
                </div>
            </div>
        </div>
    );
}
