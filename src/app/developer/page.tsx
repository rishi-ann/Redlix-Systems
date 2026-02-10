"use client";

import { useEffect, useState } from "react";
import DeveloperSidebar from "@/components/layout/DeveloperSidebar";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

interface AssignedClient {
    id: string;
    name: string;
    totalBudget: string;
    status?: string; // We'll derive this or fetch it if possible, for now we might mock or fetch reports
    reports: { status: string, createdAt: string }[];
}

export default function DeveloperDashboard() {
    const [clients, setClients] = useState<AssignedClient[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchData() {
        try {
            // We use the existing clients API which we can enhance to include recent reports if needed
            // For now, let's fetch clients and we'll visualize them
            const res = await fetch("/api/developer/clients");
            if (res.ok) {
                const data = await res.json();
                // Since our current clients API doesn't return reports, we might need to fetch them or update the API
                // For this Polish step, let's update the API to include reports or make a new composite call.
                // Actually, let's just use the client list for now and maybe fetch recent reports separately or assume clean slate.
                // To be precise, let's assume we want to show "Active Projects".
                setClients(data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans selection:bg-emerald-100">
            <DeveloperSidebar />

            <main className="flex-1 ml-64 p-12">
                <header className="flex justify-between items-start mb-16">
                    <div>
                        <h1 className="text-2xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                            Nexus <span className="text-emerald-600">Workspace</span>
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-normal">
                            Developer console for project management and status reporting.
                        </p>
                    </div>
                    <LogoutButton />
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Project List */}
                    <section className="lg:col-span-3 space-y-6">
                        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                            <div className="flex justify-between items-center px-8 py-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10">
                                <h3 className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">Active Projects</h3>
                                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-100 dark:border-emerald-900/50 uppercase tracking-widest">
                                    {clients.length} Assigned
                                </span>
                            </div>

                            <div className="p-2 space-y-2">
                                {loading ? (
                                    <div className="text-center py-12 text-zinc-400 font-normal italic text-sm">Synchronizing project data...</div>
                                ) : clients.length === 0 ? (
                                    <div className="text-center py-12 text-zinc-400 font-normal italic text-sm">No active project assignments.</div>
                                ) : (
                                    clients.map((client) => (
                                        <div key={client.id} className="p-6 rounded-2xl bg-zinc-50/20 dark:bg-zinc-900/10 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/40 transition-all group">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="text-[14px] font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{client.name}</h4>
                                                    <div className="text-[10px] text-zinc-400 mt-1">ID: {client.id}</div>
                                                </div>
                                                <Link
                                                    href={`/developer/clients/${client.id}/report`}
                                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg transition-colors"
                                                >
                                                    Update Status
                                                </Link>
                                            </div>
                                            <div className="flex justify-between items-center mt-6">
                                                <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                                                    Budget: <span className="text-zinc-900 dark:text-zinc-100">₹{client.totalBudget || "—"}</span>
                                                </div>
                                                <Link href="/developer/clients" className="text-[10px] text-emerald-600 hover:underline">
                                                    View Details →
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Side Info */}
                    <section className="space-y-6">
                        <div className="bg-emerald-600 rounded-3xl p-8 shadow-xl shadow-emerald-500/10 border border-emerald-500/50">
                            <h3 className="text-lg font-medium text-white mb-1 tracking-tight italic">Performance</h3>
                            <p className="text-emerald-100/60 text-[10px] font-medium mb-8 uppercase tracking-[0.2em]">Live Metric Stream</p>

                            <div className="space-y-6">
                                <div className="flex justify-between items-end border-b border-white/10 pb-3">
                                    <span className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest">Projects</span>
                                    <span className="text-2xl font-light text-white leading-none">{clients.length}</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/10 pb-3">
                                    <span className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest">Efficiency</span>
                                    <span className="text-2xl font-light text-white leading-none">100%</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
                            <h3 className="text-[10px] font-bold text-zinc-400 mb-6 uppercase tracking-[0.2em]">Quick Actions</h3>
                            <ul className="space-y-4 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                                <li className="flex items-center gap-3 hover:text-emerald-600 cursor-pointer transition-colors group">
                                    <Link href="/developer/clients" className="flex items-center gap-3 w-full">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> View All Clients
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
