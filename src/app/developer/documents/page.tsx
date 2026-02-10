"use client";

import { useEffect, useState } from "react";
import DeveloperSidebar from "@/components/layout/DeveloperSidebar";

interface ClientDocument {
    id: string;
    title: string;
    url: string;
    description?: string;
    createdAt: string;
    client: { name: string };
}

export default function DeveloperDocumentsPage() {
    const [documents, setDocuments] = useState<ClientDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewingDoc, setViewingDoc] = useState<ClientDocument | null>(null);

    useEffect(() => {
        async function fetchDocuments() {
            try {
                const res = await fetch("/api/developer/documents");
                if (res.ok) {
                    setDocuments(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch documents", error);
            } finally {
                setLoading(false);
            }
        }
        fetchDocuments();
    }, []);

    return (
        <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans selection:bg-emerald-100">
            <DeveloperSidebar />

            <main className="flex-1 ml-64 p-12">
                <header className="mb-16">
                    <h1 className="text-2xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                        Project <span className="text-emerald-600">Documents</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs font-normal">
                        Files uploaded by your assigned clients.
                    </p>
                </header>

                <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="p-12 text-center text-zinc-400 italic text-sm">Loading documents...</div>
                    ) : documents.length === 0 ? (
                        <div className="p-12 text-center text-zinc-400 italic text-sm">No documents found for your clients.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                                    <tr>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Date</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Client</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Document</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {documents.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors group">
                                            <td className="px-6 py-5 text-[11px] font-mono text-zinc-500">
                                                {new Date(doc.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-[13px] font-medium text-emerald-600 dark:text-emerald-400">{doc.client.name}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-[12px] font-medium text-zinc-900 dark:text-zinc-100">{doc.title}</div>
                                                <div className="text-[10px] text-zinc-400 max-w-md truncate">{doc.description || "No description"}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <a
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded text-[10px] font-bold uppercase tracking-widest transition-colors"
                                                >
                                                    View
                                                </a>
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
