"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthInput } from "@/components/ui/AuthInput";
import { AuthButton } from "@/components/ui/AuthButton";
import { createClient } from "@/lib/supabase/client";

export default function DeveloperSignup() {
    const supabase = createClient();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/developer/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const text = await res.text();
                setError(text);
                setLoading(false);
                return;
            }

            router.push("/developer/login");
        } catch (err) {
            setError("Registration failed");
            setLoading(false);
        }
    }

    async function handleGoogleSignup() {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/api/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });
            if (error) setError(error.message);
        } catch (err) {
            setError("Google synchronization failed");
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col selection:bg-emerald-100 font-sans">
            {/* Navbar */}
            <nav className="z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/80 px-8 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div
                        onClick={() => router.push('/')}
                        className="cursor-pointer flex items-center gap-2.5"
                    >
                        <a href="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770405388/icon-removebg-preview_v3cxkb.png" target="_blank" rel="noopener noreferrer" className="mr-2">
                            <img src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770405388/icon-removebg-preview_v3cxkb.png" alt="External Logo" className="h-6 w-6" />
                        </a>
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-normal tracking-[0.2em] text-zinc-900 dark:text-white uppercase leading-none">
                            CSAPP<span className="text-zinc-400">Portal</span>
                        </span>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center px-8 sm:px-24">
                <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Header Section */}
                    <header className="mb-10 text-center">
                        <h1 className="text-3xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                            Developer <span className="text-emerald-600">Onboarding</span>
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-normal">
                            Register your credentials in the developer registry.
                        </p>
                    </header>

                    {/* Signup Container */}
                    <div className="p-8 rounded-3xl border border-zinc-100 dark:border-zinc-900 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-xl shadow-emerald-500/5">
                        <form onSubmit={handleSignup} className="space-y-5">
                            {error && (
                                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 p-3 rounded-full text-[12px] font-normal text-center">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block px-4">Registration Email</label>
                                    <AuthInput
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-white dark:bg-zinc-950/50 border-zinc-100 dark:border-zinc-800 text-[13px] h-12 font-normal rounded-full focus:ring-emerald-500/20 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block px-4">Set Access Pass</label>
                                    <AuthInput
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="bg-white dark:bg-zinc-950/50 border-zinc-100 dark:border-zinc-800 text-[13px] h-12 font-normal rounded-full focus:ring-emerald-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <AuthButton
                                    loading={loading}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-normal uppercase tracking-widest h-12 rounded-full transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    Initialize Registry
                                </AuthButton>
                            </div>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-zinc-100 dark:border-zinc-800"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                                    <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-400">Sync with</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleSignup}
                                className="w-full flex items-center justify-center gap-3 bg-white dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 h-12 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span className="text-[11px] font-normal uppercase tracking-widest text-zinc-900 dark:text-zinc-100">Continue with Google</span>
                            </button>

                            <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-6 font-normal uppercase tracking-[0.2em] text-center leading-relaxed">
                                Already registered?{" "}
                                <a href="/developer/login" className="text-emerald-600 hover:underline underline-offset-4 decoration-emerald-200">System Login</a>
                            </p>
                        </form>
                    </div>

                    <button
                        onClick={() => router.back()}
                        className="mt-8 mx-auto text-[11px] text-zinc-400 hover:text-emerald-600 transition-colors flex items-center gap-2 group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Entry
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full bg-emerald-600 dark:bg-emerald-500 py-8 text-black lg:py-12 px-8">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col items-center sm:items-start">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
                            <span className="text-[10px] font-normal tracking-[0.2em] uppercase text-black">CSAPP Precision</span>
                        </div>
                        <p className="text-xs font-light text-black/80 text-center sm:text-left">
                            Architectural management for modern workflows.
                        </p>
                    </div>
                    <div className="flex gap-8 text-[10px] font-normal uppercase tracking-widest text-black/70">
                        <a href="/privacy" className="underline-offset-4 hover:underline transition-all">Privacy</a>
                        <a href="/terms" className="underline-offset-4 hover:underline transition-all">Terms</a>
                        <div className="text-[10px] font-normal tracking-wider uppercase">
                            © {new Date().getFullYear()} CSAPP Precision
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
