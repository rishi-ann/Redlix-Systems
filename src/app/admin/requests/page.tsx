"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";

interface ProjectRequest {
    id: string;
    clientName: string;
    clientEmail: string;
    projectTitle: string;
    description: string;
    budget: string | null;
    status: string;
    createdAt: string;
}

export default function AdminRequestsPage() {
    const [requests, setRequests] = useState<ProjectRequest[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchRequests() {
        try {
            const res = await fetch("/api/admin/requests");
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (error) {
            console.error("Failed to fetch requests:", error);
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id: string, status: string) {
        try {
            const res = await fetch("/api/admin/requests", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });
            if (res.ok) {
                fetchRequests();
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    }

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans selection:bg-emerald-100">
            <AdminSidebar />

            <main className="flex-1 ml-64 p-12">
                <header className="mb-16">
                    <h1 className="text-2xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                        Project <span className="text-emerald-600">Requests</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs font-normal">
                        Audit and classification of incoming systemic opportunities.
                    </p>
                </header>

                <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                    <div className="grid grid-cols-1 divide-y divide-zinc-100 dark:divide-zinc-800">
                        {loading ? (
                            <div className="p-12 text-center text-zinc-400 italic text-sm">Synchronizing request registry...</div>
                        ) : requests.length === 0 ? (
                            <div className="p-12 text-center text-zinc-400 italic text-sm">Registry clear. No incoming proposals.</div>
                        ) : (
                            requests.map((request) => (
                                <div key={request.id} className="p-8 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100 mb-1">{request.projectTitle}</h3>
                                            <div className="flex gap-4 text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
                                                <span>{request.clientName}</span>
                                                <span className="text-zinc-200 dark:text-zinc-800">•</span>
                                                <span>{request.clientEmail}</span>
                                                {request.budget && (
                                                    <>
                                                        <span className="text-zinc-200 dark:text-zinc-800">•</span>
                                                        <span className="text-emerald-600 dark:text-emerald-500">{request.budget}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <select
                                                value={request.status}
                                                onChange={(e) => updateStatus(request.id, e.target.value)}
                                                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border appearance-none transition-all cursor-pointer focus:outline-none
                                                    ${request.status === "PENDING" ? "bg-zinc-50 dark:bg-zinc-900 text-zinc-500 border-zinc-100 dark:border-zinc-800" :
                                                        request.status === "APPROVED" ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50" :
                                                            "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/50"}
                                                `}
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="APPROVED">Approved</option>
                                                <option value="REJECTED">Rejected</option>
                                            </select>
                                            <span className="text-[10px] text-zinc-400 font-normal">
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-3xl">
                                        {request.description}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
