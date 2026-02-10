"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";

interface ContactInquiry {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
}

export default function AdminContactPage() {
    const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchInquiries() {
        try {
            const res = await fetch("/api/admin/contact");
            if (res.ok) {
                const data = await res.json();
                setInquiries(data);
            }
        } catch (error) {
            console.error("Failed to fetch inquiries:", error);
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id: string, status: string) {
        try {
            const res = await fetch("/api/admin/contact", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });
            if (res.ok) {
                fetchInquiries();
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    }

    useEffect(() => {
        fetchInquiries();
    }, []);

    return (
        <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans selection:bg-emerald-100">
            <AdminSidebar />

            <main className="flex-1 ml-64 p-12">
                <header className="mb-16">
                    <h1 className="text-2xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                        System <span className="text-emerald-600">Inquiries</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs font-normal">
                        Incoming external communications channel.
                    </p>
                </header>

                <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                    <div className="grid grid-cols-1 divide-y divide-zinc-100 dark:divide-zinc-800">
                        {loading ? (
                            <div className="p-12 text-center text-zinc-400 italic text-sm">Syncing secure channel...</div>
                        ) : inquiries.length === 0 ? (
                            <div className="p-12 text-center text-zinc-400 italic text-sm">Channel silent. No active inquiries.</div>
                        ) : (
                            inquiries.map((inquiry) => (
                                <div key={inquiry.id} className="p-8 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100 mb-1">{inquiry.subject}</h3>
                                            <div className="flex gap-4 text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
                                                <span>{inquiry.name}</span>
                                                <span className="text-zinc-200 dark:text-zinc-800">•</span>
                                                <span>{inquiry.email}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <select
                                                value={inquiry.status}
                                                onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                                                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border appearance-none transition-all cursor-pointer focus:outline-none
                                                    ${inquiry.status === "UNREAD" ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50" :
                                                        inquiry.status === "READ" ? "bg-zinc-50 dark:bg-zinc-900 text-zinc-500 border-zinc-100 dark:border-zinc-800" :
                                                            "bg-zinc-100 dark:bg-zinc-900/50 text-zinc-400 border-zinc-200 dark:border-zinc-800"}
                                                `}
                                            >
                                                <option value="UNREAD">Unread</option>
                                                <option value="READ">Read</option>
                                                <option value="ARCHIVED">Archived</option>
                                            </select>
                                            <span className="text-[10px] text-zinc-400 font-normal">
                                                {new Date(inquiry.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-3xl whitespace-pre-wrap">
                                        {inquiry.message}
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
