"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ClientDocuments from "@/components/ClientDocuments";

export default function ClientDocumentsPage() {
    const router = useRouter();
    const [client, setClient] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchClientData() {
            try {
                const res = await fetch("/api/client/data");
                if (res.ok) {
                    setClient(await res.json());
                } else {
                    router.push("/client/login");
                }
            } catch (error) {
                console.error("Failed to fetch client data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchClientData();
    }, [router]);

    async function logout() {
        await fetch("/api/client/logout", { method: "POST" });
        window.location.href = "/client/login";
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 text-zinc-400 text-xs uppercase tracking-widest">Loading Secure Environment...</div>;
    }

    if (!client) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col selection:bg-emerald-100 font-sans">
            {/* Navbar */}
            <nav className="w-full bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/50 px-4 sm:px-8 py-4">
                <div className="max-w-6xl mx-auto flex flex-row justify-between items-center gap-2">
                    <div
                        onClick={() => router.push('/client')}
                        className="cursor-pointer flex items-center gap-1.5 sm:gap-2 font-mono text-[9px] sm:text-[11px] tracking-widest sm:tracking-[0.2em] text-emerald-700 dark:text-emerald-400 uppercase whitespace-nowrap"
                    >
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-500 rounded-full shrink-0" />
                        Client Node
                    </div>
                    <div className="flex gap-3 sm:gap-6 items-center overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => router.push('/client')}
                            className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-emerald-600 transition-colors whitespace-nowrap"
                        >
                            Dashboard
                        </button>
                        <button
                            className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 whitespace-nowrap"
                        >
                            Docs
                        </button>
                        <button
                            onClick={logout}
                            className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-red-500 transition-colors whitespace-nowrap"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            <main className="flex-grow p-4 sm:p-8 lg:p-12">
                <div className="max-w-5xl mx-auto">
                    <header className="mb-8 sm:mb-12 text-center sm:text-left">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2 block">Repository</span>
                        <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                            Project <span className="text-emerald-600">Documents</span>
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm max-w-sm mx-auto sm:mx-0 leading-relaxed">
                            Access and manage your project files and resources.
                        </p>
                    </header>

                    <ClientDocuments />
                </div>
            </main>

            <footer className="w-full bg-emerald-50 dark:bg-emerald-950/40 border-t border-emerald-100 dark:border-emerald-900/50 px-4 sm:px-8 py-6 text-center sm:text-left">
                <div className="max-w-6xl mx-auto text-[9px] sm:text-[10px] text-emerald-700/40 dark:text-emerald-400/20 font-normal tracking-wider uppercase">
                    © {new Date().getFullYear()} CSAPP Precision • Encrypted Connection
                </div>
            </footer>
        </div>
    );
}
