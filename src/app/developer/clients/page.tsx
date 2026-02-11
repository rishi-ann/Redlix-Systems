"use client";

import { useEffect, useState } from "react";
import DeveloperSidebar from "@/components/layout/DeveloperSidebar";

interface Client {
    id: string;
    name: string;
    contactName?: string;
    email?: string;
    mobile?: string;
    startDate?: string;
    endDate?: string;
    totalBudget?: string;
    amountPaid?: string;
    createdAt: string;
}

export default function DeveloperClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchClients() {
        try {
            const res = await fetch("/api/developer/clients");
            if (res.ok) {
                const data = await res.json();
                setClients(data);
            }
        } catch (error) {
            console.error("Failed to fetch clients:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchClients();
    }, []);

    return (
        <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans selection:bg-emerald-100">
            <DeveloperSidebar />

            <main className="flex-1 ml-64 p-12">
                <header className="mb-16">
                    <h1 className="text-2xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                        Assigned <span className="text-emerald-600">Clients</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs font-normal">
                        Overview of project entities under your technical jurisdiction.
                    </p>
                </header>

                <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="p-12 text-center text-zinc-400 italic text-sm">Retrieving assignment data...</div>
                    ) : clients.length === 0 ? (
                        <div className="p-12 text-center text-zinc-400 italic text-sm">No clients currently assigned to your node.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                                    <tr>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Client ID</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Entity Details</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Contact</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Timeline</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Budget (₹)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {clients.map((client) => (
                                        <tr key={client.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors group">
                                            <td className="px-6 py-5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">{client.id}</td>
                                            <td className="px-6 py-5">
                                                <div className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100">{client.name}</div>
                                                <div className="text-[10px] text-zinc-400 mt-1">Reg: {new Date(client.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-[12px] text-zinc-700 dark:text-zinc-300">{client.contactName || "—"}</div>
                                                <div className="flex flex-col gap-0.5 mt-1">
                                                    {client.email && <span className="text-[10px] text-zinc-400">{client.email}</span>}
                                                    {client.mobile && <span className="text-[10px] text-zinc-400">{client.mobile}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1 text-[10px] font-mono text-zinc-500">
                                                    {client.startDate && <span className="text-emerald-600/80 dark:text-emerald-400/80">Start: {new Date(client.startDate).toLocaleDateString()}</span>}
                                                    {client.endDate && <span className="text-red-400/80">End: {new Date(client.endDate).toLocaleDateString()}</span>}
                                                    {!client.startDate && !client.endDate && <span className="italic text-zinc-300">TBD</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="text-[13px] font-light text-zinc-900 dark:text-zinc-100">
                                                    {client.totalBudget ? `₹${client.totalBudget}` : "—"}
                                                </div>
                                                {client.amountPaid && (
                                                    <div className="text-[10px] text-emerald-600 dark:text-emerald-500 mt-1">
                                                        Paid: ₹{client.amountPaid}
                                                    </div>
                                                )}
                                                <div className="mt-2">
                                                    <button
                                                        onClick={() => window.location.href = `/developer/clients/${client.id}/report`}
                                                        className="px-3 py-1 bg-zinc-900 dark:bg-zinc-100 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white dark:text-zinc-900 text-[9px] font-bold uppercase tracking-widest rounded transition-colors"
                                                    >
                                                        Update Status
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
