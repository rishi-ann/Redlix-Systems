"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";

interface ClientDocument {
    id: string;
    title: string;
    url: string;
    size?: number;
    type?: string;
    description?: string;
    createdAt: string;
    client: { name: string; developers?: { email: string }[] };
}

export default function AdminDocumentsPage() {
    const [documents, setDocuments] = useState<ClientDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewingDoc, setViewingDoc] = useState<ClientDocument | null>(null);

    useEffect(() => {
        async function fetchDocuments() {
            try {
                const res = await fetch("/api/admin/documents");
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
            <AdminSidebar />

            <main className="flex-1 ml-64 p-12">
                <header className="mb-16">
                    <h1 className="text-2xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                        Client <span className="text-emerald-600">Documents</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs font-normal">
                        Repository of all files uploaded by clients.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center text-zinc-400 italic text-sm py-12">Loading repository...</div>
                    ) : documents.length === 0 ? (
                        <div className="col-span-full text-center text-zinc-400 italic text-sm py-12">No documents found.</div>
                    ) : (
                        documents.map((doc) => (
                            <div key={doc.id} className="group p-6 bg-white dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 rounded-2xl hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-emerald-600 transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[9px] text-zinc-400 font-mono mb-0.5">{new Date(doc.createdAt).toLocaleDateString()}</div>
                                        {doc.size && (
                                            <div className="text-[8px] text-zinc-500 font-mono uppercase tracking-tighter">
                                                {(doc.size / (1024 * 1024)).toFixed(2)} MB
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <h3 className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-1 truncate" title={doc.title}>
                                    {doc.title}
                                </h3>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{doc.client.name}</span>
                                    {doc.type && (
                                        <span className="text-[8px] text-zinc-400 px-1 py-0.5 bg-zinc-50 dark:bg-zinc-800 rounded border border-zinc-100 dark:border-zinc-700 uppercase font-mono">
                                            {doc.type.split('/')[1] || 'DOC'}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 h-[2.5em]">
                                    {doc.description || "No description provided."}
                                </p>
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-2 text-center bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors border border-zinc-100 dark:border-zinc-800"
                                >
                                    View Document
                                </a>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
