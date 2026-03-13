"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthInput } from "@/components/ui/AuthInput";
import { AuthButton } from "@/components/ui/AuthButton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
        <div className="min-h-screen bg-white flex flex-col selection:bg-red-100 font-sans text-zinc-900">
            {/* Navbar */}
            <nav className="z-50 w-full border-b border-red-700 bg-red-600/90 backdrop-blur-xl shadow-sm">
                <div className="max-w-7xl mx-auto px-6 flex h-20 justify-between items-center">
                    <div
                        onClick={() => router.push('/')}
                        className="cursor-pointer flex items-center gap-1.5 sm:gap-2.5"
                    >
                        <img src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-13_at_21.00.59-removebg-preview.png" alt="Logo" className="h-10 w-auto brightness-0 invert" />
                    </div>
                    <div className="flex gap-4 items-center">
                        <Link href="/request" className="text-[11px] font-semibold tracking-wide text-white hover:text-white/80 transition-all">
                            New Request
                        </Link>
                        <Link href="/contact" className="px-5 py-2.5 bg-white text-[11px] font-semibold tracking-wide text-red-600 transition-all hover:bg-zinc-100 rounded-none">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center px-4 sm:px-8 py-12">
                <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-left-4 duration-700">

                    {/* Header Section */}
                    <header className="mb-8 sm:mb-10 text-center">
                        <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-zinc-900 mb-2">
                            Client <span className="text-red-600">Login</span>
                        </h1>
                        <p className="text-zinc-500 text-xs font-normal px-4">
                            Enter your ID to access your project dashboard.
                        </p>
                    </header>

                    {/* Login Container */}
                    <div className="p-8 sm:p-12 border border-zinc-100 bg-white rounded-none shadow-sm mx-2 sm:mx-0">
                        <form onSubmit={handleLogin} className="space-y-8">
                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-none text-[12px] font-medium text-center">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-wider text-red-600 uppercase px-1">Your Client ID</label>
                                    <AuthInput
                                        type="text"
                                        placeholder="RED-XXXX"
                                        value={clientId}
                                        onChange={(e) => setClientId(e.target.value)}
                                        required
                                        className="h-12 border-zinc-400 bg-white text-center tracking-[0.1em] uppercase font-bold"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold tracking-wide h-12 rounded-none transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/10 disabled:opacity-50"
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </button>
                            </div>

                            <p className="text-[10px] text-zinc-400 mt-6 font-bold uppercase tracking-[0.2em] text-center leading-relaxed">
                                Secure Login • 24/7 Support
                            </p>
                        </form>
                    </div>

                    <button
                        onClick={() => router.back()}
                        className="mt-8 text-[11px] text-zinc-400 hover:text-red-600 transition-colors flex items-center gap-2 group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Entry
                    </button>
                </div>
            </main>

            {/* Signature Redlix Studio Footer */}
            <footer className="w-full bg-red-600 py-12 lg:py-20 text-white border-t border-red-500/30">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-10">
                        <div className="flex flex-col items-center sm:items-start">
                            <div className="flex items-center gap-2.5 mb-3">
                                <span className="h-2 w-2 bg-white animate-pulse" />
                                <span className="text-xs font-semibold tracking-wider text-white">CSAPP Precision</span>
                            </div>
                            <p className="text-sm font-medium text-white/70 text-center sm:text-left max-w-md">
                                Elegant and simple tools for modern teams and high-performance projects.
                            </p>
                        </div>

                        <div className="flex gap-10 text-xs font-semibold tracking-wide text-white/60">
                            <Link href="/privacy" className="hover:text-white transition-all hover:translate-y-[-1px]">Privacy</Link>
                            <Link href="/terms" className="hover:text-white transition-all hover:translate-y-[-1px]">Terms</Link>
                            <span className="cursor-default text-white/40">© {new Date().getFullYear()} Redlix</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
