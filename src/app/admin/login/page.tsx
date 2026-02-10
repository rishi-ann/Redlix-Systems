"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthInput } from "@/components/ui/AuthInput";
import { AuthButton } from "@/components/ui/AuthButton";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                setError(await res.text());
                setLoading(false);
                return;
            }

            router.push("/admin");
        } catch (err) {
            setError("Authorization server error");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col selection:bg-emerald-100">
            {/* Navbar */}
            <nav className="w-full bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/50 px-8 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div
                        onClick={() => router.push('/')}
                        className="cursor-pointer flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-emerald-700 dark:text-emerald-400 uppercase"
                    >
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        CSAPP Portal
                    </div>
                    <div className="flex gap-6 items-center">
                        <a href="/request" className="text-[10px] font-normal uppercase tracking-wider text-emerald-700 dark:text-emerald-400 hover:opacity-70 transition-opacity">
                            New Request
                        </a>
                        <a href="/contact" className="text-[10px] font-normal uppercase tracking-wider text-emerald-700 dark:text-emerald-400 hover:opacity-70 transition-opacity">
                            Contact Us
                        </a>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-start px-8 sm:px-24">
                <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-left-4 duration-700">

                    {/* Header Section */}
                    <header className="mb-10">
                        <h1 className="text-2xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                            Admin <span className="text-emerald-600">Authentication</span>
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-normal">
                            System level access for global configuration.
                        </p>
                    </header>

                    {/* Login Container */}
                    <div className="p-8 rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/20">
                        <form onSubmit={handleLogin} className="space-y-5">
                            {error && (
                                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 p-3 rounded-lg text-[12px] font-normal text-left">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block">Email Address</label>
                                    <AuthInput
                                        type="email"
                                        placeholder="admin@csapp.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:border-emerald-500 text-sm h-10 transition-all font-normal"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block">Access Key</label>
                                    <AuthInput
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:border-emerald-500 text-sm h-10 transition-all font-normal"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <AuthButton
                                    loading={loading}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-normal uppercase tracking-widest h-10 rounded-lg transition-all shadow-none"
                                >
                                    Initialize Override
                                </AuthButton>
                            </div>

                            <p className="text-[9px] text-zinc-400 dark:text-zinc-600 mt-6 font-normal uppercase tracking-[0.2em] leading-relaxed">
                                Security Protocol: All access attempts are logged and monitored via encrypted audit trails.
                            </p>
                        </form>
                    </div>

                    <button
                        onClick={() => router.back()}
                        className="mt-8 text-[11px] text-zinc-400 hover:text-emerald-600 transition-colors flex items-center gap-2"
                    >
                        ← Return to Portal Selection
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full bg-emerald-50 dark:bg-emerald-950/40 border-t border-emerald-100 dark:border-emerald-900/50 px-8 py-6">
                <div className="max-w-6xl mx-auto flex justify-between items-center text-[10px] text-emerald-700/60 dark:text-emerald-400/40 font-normal tracking-wider uppercase">
                    <div>© {new Date().getFullYear()} CSAPP Precision</div>
                    <div className="flex gap-6">
                        <a href="/privacy" className="hover:text-emerald-600 transition-colors">Privacy</a>
                        <a href="/terms" className="hover:text-emerald-600 transition-colors">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}