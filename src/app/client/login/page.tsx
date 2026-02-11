"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthInput } from "@/components/ui/AuthInput";
import { AuthButton } from "@/components/ui/AuthButton";

export default function ClientLogin() {
    const router = useRouter();
    const [clientId, setClientId] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/client/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ clientId }),
            });

            if (!res.ok) {
                setError(await res.text());
                setLoading(false);
                return;
            }

            router.push("/client");
        } catch (err) {
            setError("Authorization failure");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col selection:bg-emerald-100 font-sans">
            {/* Navbar */}
            <nav className="z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/80 px-8 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                        <a href="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770405388/icon-removebg-preview_v3cxkb.png" target="_blank" rel="noopener noreferrer" className="mr-2">
                            <img src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770405388/icon-removebg-preview_v3cxkb.png" alt="External Logo" className="h-6 w-6" />
                        </a>
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-normal tracking-[0.2em] text-zinc-900 dark:text-white uppercase leading-none">
                            CSAPP<span className="text-zinc-400">Client</span>
                        </span>
                    </div>
                    <div className="flex gap-6 items-center">
                        <a href="/request" className="text-[10px] font-normal uppercase tracking-wider text-zinc-400 hover:text-emerald-600 transition-opacity">
                            New Request
                        </a>
                        <a href="/contact" className="rounded-full bg-emerald-600 px-4 py-1.5 text-[10px] font-normal uppercase tracking-widest text-white transition-colors hover:bg-emerald-500">
                            Contact
                        </a>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center px-8 sm:px-24">
                <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-left-4 duration-700">

                    {/* Header Section */}
                    <header className="mb-10">
                        <h1 className="text-2xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                            Secure <span className="text-emerald-600">Client Access</span>
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-normal">
                            Verify your unique identifier to access the partner portal.
                        </p>
                    </header>

                    {/* Login Container */}
                    <div className="p-8 rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                        <form onSubmit={handleLogin} className="space-y-5">
                            {error && (
                                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 p-3 rounded-lg text-[12px] font-normal text-left">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block px-1">Unique Protocol ID</label>
                                    <AuthInput
                                        type="text"
                                        placeholder="RED-XXXX"
                                        value={clientId}
                                        onChange={(e) => setClientId(e.target.value)}
                                        required
                                        className="bg-white dark:bg-zinc-950/50 border-zinc-100 dark:border-zinc-800 text-[13px] h-12 font-normal text-center tracking-[0.1em] uppercase rounded-full focus:ring-emerald-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <AuthButton
                                    loading={loading}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-normal uppercase tracking-widest h-11 rounded-full transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    Verify & Enter
                                </AuthButton>
                            </div>

                            <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-6 font-normal uppercase tracking-[0.2em] text-center leading-relaxed">
                                Encrypted Session • ISO-27001 Certified Access
                            </p>
                        </form>
                    </div>

                    <button
                        onClick={() => router.back()}
                        className="mt-8 text-[11px] text-zinc-400 hover:text-emerald-600 transition-colors flex items-center gap-2"
                    >
                        ← Back to Entry
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
