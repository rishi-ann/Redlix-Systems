"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";

interface Developer {
    id: string;
    email: string;
    createdAt: string;
}

interface Client {
    id: string;
    name: string;
}

export default function AdminDashboard() {
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDev, setSelectedDev] = useState<Developer | null>(null);
    const [selectedClientId, setSelectedClientId] = useState("");
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [demoLink, setDemoLink] = useState("");
    const [assigning, setAssigning] = useState(false);

    async function fetchData() {
        try {
            const [devsRes, clientsRes] = await Promise.all([
                fetch("/api/admin/developers"),
                fetch("/api/admin/clients")
            ]);

            if (devsRes.ok) {
                const devsData = await devsRes.json();
                setDevelopers(devsData);
            }
            if (clientsRes.ok) {
                const clientsData = await clientsRes.json();
                setClients(clientsData);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
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
                    clientId: selectedClientId,
                }),
            });

            if (res.ok) {
                alert("Task assigned successfully.");
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
        fetchData();
    }, []);

    return (
        <div className="flex bg-white dark:bg-white min-h-screen font-sans selection:bg-red-100">
            <AdminSidebar />

            <main className="flex-1 ml-64 p-12">
                <header className="flex justify-between items-start mb-16">
                    <div>
                        <h1 className="text-2xl font-normal tracking-tight text-zinc-900 mb-2">
                            Admin <span className="text-red-600">Dashboard</span>
                        </h1>
                        <p className="text-zinc-500 text-xs font-normal">
                            Manage your platform and projects in one place.
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        className="px-6 py-2 bg-white border border-red-600 text-red-600 font-semibold text-[11px] uppercase tracking-widest rounded-none hover:bg-zinc-50 transition-all"
                    >
                        Logout
                    </button>
                </header>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12">
                    <div className="p-6 rounded-none border border-zinc-100 bg-zinc-50/50">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-400 block mb-1">Total Developers</span>
                        <span className="text-2xl font-normal text-zinc-900">{developers.length}</span>
                    </div>
                    {/* Simplified Stats */}
                    {['Platform Health', 'System Uptime', 'Active Tasks'].map((label, i) => (
                        <div key={label} className="p-6 rounded-none border border-zinc-100 bg-zinc-50/50">
                            <span className="text-[10px] uppercase tracking-widest text-zinc-400 block mb-1">{label}</span>
                            <span className="text-2xl font-normal text-zinc-900">{i === 0 ? 'Good' : i === 1 ? '99.9%' : '12'}</span>
                        </div>
                    ))}
                </div>

                <section className="bg-white border border-zinc-100 border-t-2 border-t-red-600 rounded-none overflow-hidden shadow-xl shadow-red-600/5">
                    <div className="px-8 py-6 border-b border-zinc-100 flex justify-between items-center bg-white">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-4 bg-red-600" />
                            <h3 className="text-[14px] font-bold text-zinc-900 uppercase tracking-[0.1em]">Developer Registry</h3>
                        </div>
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-1 uppercase tracking-widest">
                            {developers.length} Total Users
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-zinc-900 bg-zinc-900">
                                    <th className="px-8 py-4 text-[10px] font-bold text-white uppercase tracking-widest">User Email</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-white uppercase tracking-widest">Unique Identifier</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-white uppercase tracking-widest">Current Status</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-white uppercase tracking-widest text-right">Management</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-[12px]">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center text-zinc-400 font-normal italic">Loading developers...</td>
                                    </tr>
                                ) : developers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center text-zinc-400 font-normal italic uppercase tracking-widest text-[10px] font-bold">No developers joined yet.</td>
                                    </tr>
                                ) : (
                                    developers.map((dev) => (
                                        <tr key={dev.id} className="hover:bg-red-50/30 transition-all duration-200 group border-b border-zinc-50 last:border-0">
                                            <td className="px-8 py-5">
                                                <span className="text-zinc-900 font-bold tracking-tight text-[13px]">{dev.email}</span>
                                            </td>
                                            <td className="px-8 py-5 font-bold text-[9px] text-zinc-400 uppercase tracking-[0.2em]">{dev.id}</td>
                                            <td className="px-8 py-5">
                                                <span className="inline-flex items-center gap-1.5 text-zinc-600 font-bold uppercase tracking-widest text-[10px]">
                                                    <span className="w-1.5 h-1.5 bg-red-600" />
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button
                                                    onClick={() => setSelectedDev(dev)}
                                                    className="text-[11px] font-bold text-red-600 uppercase tracking-widest hover:underline underline-offset-4"
                                                >
                                                    Assign Task
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Task Assignment Modal */}
                {selectedDev && (
                    <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                        <form
                            onSubmit={assignTask}
                            className="bg-white border-t-4 border-red-600 p-12 rounded-none shadow-[0_35px_60px_-15px_rgba(220,38,38,0.15)] w-full max-w-2xl space-y-10 animate-in zoom-in-95 duration-500"
                        >
                            <div>
                                <h3 className="text-xl font-normal text-zinc-900 mb-1">Assign <span className="text-red-600">Task</span></h3>
                                <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">{selectedDev.email}</p>
                            </div>

                             <div className="space-y-8">
                                <div className="space-y-2 text-left">
                                    <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] px-1">Choose Client</label>
                                    <div className="relative">
                                        <select
                                            required
                                            value={selectedClientId}
                                            onChange={(e) => setSelectedClientId(e.target.value)}
                                            className="w-full bg-white border border-zinc-300 rounded-none px-6 py-5 text-zinc-900 text-[13px] font-bold uppercase tracking-widest focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/10 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" className="font-sans">Select Project Partner...</option>
                                            {clients.map((client) => (
                                                <option key={client.id} value={client.id} className="font-sans">
                                                    {client.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-red-600">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 text-left">
                                    <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] px-1">Task Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={taskTitle}
                                        onChange={(e) => setTaskTitle(e.target.value)}
                                        placeholder="Brief objective..."
                                        className="w-full bg-white border border-zinc-300 rounded-none px-6 py-5 text-zinc-900 text-[13px] font-bold uppercase tracking-widest focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/10 transition-all"
                                    />
                                </div>
                                <div className="space-y-2 text-left">
                                    <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] px-1">Detailed Description</label>
                                    <textarea
                                        rows={5}
                                        value={taskDesc}
                                        onChange={(e) => setTaskDesc(e.target.value)}
                                        placeholder="Technical requirements and goals..."
                                        className="w-full bg-white border border-zinc-300 rounded-none px-6 py-5 text-zinc-900 text-[13px] font-bold uppercase tracking-widest focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/10 transition-all resize-none shadow-sm"
                                    />
                                </div>
                            </div>

                             <div className="flex gap-6 pt-6 animate-in slide-in-from-bottom-2 duration-700">
                                <button
                                    type="button"
                                    onClick={() => setSelectedDev(null)}
                                    className="flex-1 py-5 border border-zinc-200 text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] rounded-none hover:bg-zinc-50 hover:text-zinc-800 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={assigning}
                                    className="flex-3 py-5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-none hover:bg-red-700 transition-all duration-300 shadow-xl shadow-red-600/20 px-12"
                                >
                                    {assigning ? "Transmitting..." : "Assign Directive"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}
