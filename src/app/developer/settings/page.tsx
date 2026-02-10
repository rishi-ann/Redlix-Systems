"use client";

import { useEffect, useState } from "react";
import DeveloperSidebar from "@/components/layout/DeveloperSidebar";
import LogoutButton from "@/components/LogoutButton";

interface DeveloperProfile {
    id: string;
    email: string;
    createdAt: string;
    _count: {
        clients: number;
        tasks: number;
        reports: number;
    }
}

export default function DeveloperSettings() {
    const [profile, setProfile] = useState<DeveloperProfile | null>(null);
    const [loading, setLoading] = useState(true);

    async function fetchProfile() {
        try {
            const res = await fetch("/api/developer/profile");
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans selection:bg-emerald-100 text-zinc-900 dark:text-zinc-100">
            <DeveloperSidebar />

            <main className="flex-1 ml-64 p-12">
                <header className="flex justify-between items-start mb-16">
                    <div>
                        <h1 className="text-2xl font-normal tracking-tight mb-2">
                            Node <span className="text-emerald-600">Settings</span>
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-normal">
                            Manage your developer profile and synchronization settings.
                        </p>
                    </div>
                    <LogoutButton />
                </header>

                <div className="max-w-2xl">
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Profile Identity Card */}
                        <section className="bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-emerald-500/20">
                                    {profile?.email?.[0].toUpperCase() || "D"}
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium tracking-tight">System Identity</h3>
                                    <p className="text-emerald-600 text-[10px] uppercase tracking-[0.2em] font-bold">Verified Developer Node</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-1">
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 ml-1">Registry Email</label>
                                    <div className="px-5 py-3.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm font-medium">
                                        {loading ? "Syncing..." : profile?.email}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-1">
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 ml-1">Node Identifier</label>
                                    <div className="px-5 py-3.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-[12px] font-mono text-zinc-500">
                                        {loading ? "Syncing..." : profile?.id}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-1">
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 ml-1">Synchronization Date</label>
                                    <div className="px-5 py-3.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm font-medium">
                                        {loading ? "Syncing..." : profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : "—"}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* System Stats Section */}
                        <section className="bg-emerald-600 rounded-3xl p-8 shadow-xl shadow-emerald-500/10 border border-emerald-500/50 text-white">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-emerald-100/60">Node Statistics</h3>
                            <div className="grid grid-cols-3 gap-8">
                                <div className="space-y-1">
                                    <p className="text-2xl font-light leading-none">{profile?._count.clients || 0}</p>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-100/40">Clients</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl font-light leading-none">{profile?._count.tasks || 0}</p>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-100/40">Tasks</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl font-light leading-none">{profile?._count.reports || 0}</p>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-100/40">Reports</p>
                                </div>
                            </div>
                        </section>

                        {/* Node Security Card */}
                        <section className="bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
                            <h3 className="text-[10px] font-bold text-zinc-400 mb-6 uppercase tracking-[0.2em]">Security Status</h3>
                            <div className="flex items-center justify-between p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[11px] font-medium uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Connection Secure</span>
                                </div>
                                <span className="text-[10px] text-zinc-400 uppercase tracking-widest">Type: OAuth/Session</span>
                            </div>
                        </section>

                        <div className="pt-4 flex justify-end">
                            <button
                                onClick={() => window.print()}
                                className="px-6 py-2 border border-zinc-200 dark:border-zinc-800 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-emerald-600 hover:border-emerald-100 transition-all"
                            >
                                Export Profile Key
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
