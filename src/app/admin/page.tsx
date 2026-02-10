"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";

interface Developer {
    id: string;
    email: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDev, setSelectedDev] = useState<Developer | null>(null);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [demoLink, setDemoLink] = useState("");
    const [assigning, setAssigning] = useState(false);

    async function fetchDevelopers() {
        try {
            const res = await fetch("/api/admin/developers");
            if (res.ok) {
                const data = await res.json();
                setDevelopers(data);
            }
        } catch (error) {
            console.error("Failed to fetch developers:", error);
        } finally {
            setLoading(false);
        }
    }

    async function assignTask(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedDev) return;
        setAssigning(true);

        try {
            const res = await fetch("/api/admin/tasks/assign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: taskTitle,
                    description: taskDesc,
                    demoLink: demoLink,
                    developerId: selectedDev.id,
                }),
            });

            if (res.ok) {
                alert("Directive issued successfully.");
                setSelectedDev(null);
                setTaskTitle("");
                setTaskDesc("");
                setDemoLink("");
            }
        } catch (error) {
            console.error("Failed to assign task:", error);
        } finally {
            setAssigning(false);
        }
    }

    async function logout() {
        await fetch("/api/admin/logout", { method: "POST" });
        window.location.href = "/admin/login";
    }

    useEffect(() => {
        fetchDevelopers();
    }, []);

    return (
        <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans selection:bg-emerald-100">
            <AdminSidebar />

            <main className="flex-1 ml-64 p-12">
                <header className="flex justify-between items-start mb-16">
                    <div>
                        <h1 className="text-2xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                            System <span className="text-emerald-600">Overview</span>
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-normal">
                            Managing global nodes and administrative directives.
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        className="px-6 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium text-[11px] uppercase tracking-widest rounded-lg hover:border-emerald-200 dark:hover:border-emerald-900 transition-all"
                    >
                        Terminal Logout
                    </button>
                </header>

                {/* Global Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12">
                    <div className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/10">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-400 block mb-1">Active Nodes</span>
                        <span className="text-2xl font-normal text-zinc-900 dark:text-zinc-100">{developers.length}</span>
                    </div>
                    {/* Mock Stats */}
                    {['System Health', 'Uptime', 'Security Alert'].map((label, i) => (
                        <div key={label} className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/10">
                            <span className="text-[10px] uppercase tracking-widest text-zinc-400 block mb-1">{label}</span>
                            <span className="text-2xl font-normal text-zinc-900 dark:text-zinc-100">{i === 1 ? '99.9%' : i === 2 ? '0' : 'Optimal'}</span>
                        </div>
                    ))}
                </div>

                <section className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
                    <div className="px-8 py-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/30 dark:bg-zinc-900/10">
                        <h3 className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">Developer Network</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/10 dark:bg-zinc-900/5">
                                    <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Registry Email</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Node Hash</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-[12px]">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center text-zinc-400 font-normal italic">Retrieving network records...</td>
                                    </tr>
                                ) : developers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center text-zinc-400 font-normal italic">Empty registry.</td>
                                    </tr>
                                ) : (
                                    developers.map((dev) => (
                                        <tr key={dev.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors group">
                                            <td className="px-8 py-5">
                                                <span className="text-zinc-700 dark:text-zinc-300 font-medium">{dev.email}</span>
                                            </td>
                                            <td className="px-8 py-5 font-mono text-[10px] text-zinc-400 tracking-tighter uppercase">{dev.id}</td>
                                            <td className="px-8 py-5">
                                                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500 font-medium">
                                                    <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                                                    Authorized
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button
                                                    onClick={() => setSelectedDev(dev)}
                                                    className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 underline underline-offset-4 decoration-emerald-200 dark:decoration-emerald-900"
                                                >
                                                    Issue Directive
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Modal - Emerald Style */}
                {selectedDev && (
                    <div className="fixed inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                        <form
                            onSubmit={assignTask}
                            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-10 rounded-3xl shadow-2xl w-full max-w-lg space-y-6 animate-in fade-in zoom-in-95 duration-300"
                        >
                            <div>
                                <h3 className="text-xl font-normal text-zinc-900 dark:text-zinc-100 mb-1">Issue <span className="text-emerald-600">Directive</span></h3>
                                <p className="text-zinc-500 text-[11px] font-normal uppercase tracking-widest">{selectedDev.email}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5 text-left">
                                    <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest px-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={taskTitle}
                                        onChange={(e) => setTaskTitle(e.target.value)}
                                        placeholder="Enter directive title..."
                                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-5 py-4 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 transition-all font-normal"
                                    />
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest px-1">Parameters</label>
                                    <textarea
                                        rows={4}
                                        value={taskDesc}
                                        onChange={(e) => setTaskDesc(e.target.value)}
                                        placeholder="Enter execution parameters..."
                                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-5 py-4 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 transition-all font-normal resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedDev(null)}
                                    className="flex-1 py-3.5 border border-zinc-100 dark:border-zinc-800 text-zinc-500 text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={assigning}
                                    className="flex-1 py-3.5 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    {assigning ? "Transmitting..." : "Initialize"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}
