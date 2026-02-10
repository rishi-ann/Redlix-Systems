"use client";

import { useState, useEffect } from "react";
import { AuthInput } from "@/components/ui/AuthInput";
import { AuthButton } from "@/components/ui/AuthButton";

interface ClientDocument {
    id: string;
    title: string;
    url: string;
    description?: string;
    createdAt: string;
}

export default function ClientDocuments() {
    const [documents, setDocuments] = useState<ClientDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [viewingDoc, setViewingDoc] = useState<ClientDocument | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        url: "",
        description: ""
    });

    async function fetchDocuments() {
        try {
            const res = await fetch("/api/client/documents");
            if (res.ok) {
                setDocuments(await res.json());
            }
        } catch (error) {
            console.error("Failed to fetch documents", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDocuments();
    }, []);

    async function handleUpload(e: React.FormEvent) {
        e.preventDefault();
        setUploading(true);
        try {
            const res = await fetch("/api/client/documents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setFormData({ title: "", url: "", description: "" });
                setShowForm(false);
                fetchDocuments();
            }
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-8 mt-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-zinc-900 dark:text-zinc-100 text-[12px] font-bold uppercase tracking-widest">Project Documents</h3>
                        <p className="text-zinc-400 text-[10px]">Upload resources and view files shared with your repository.</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors"
                >
                    {showForm ? "Cancel" : "Upload Document"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleUpload} className="mb-8 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block">Document Title</label>
                            <AuthInput
                                placeholder="e.g. Q1 Financials"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="bg-white dark:bg-zinc-950 h-9 text-[12px]"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block">File URL</label>
                            <AuthInput
                                placeholder="https://..."
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                required
                                className="bg-white dark:bg-zinc-950 h-9 text-[12px]"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block">Description (Optional)</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={2}
                            placeholder="Brief context about this file..."
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-[12px] focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                        />
                    </div>
                    <div className="flex justify-end">
                        <AuthButton
                            loading={uploading}
                            className="w-auto px-6 h-9 text-[10px]"
                        >
                            Submit Upload
                        </AuthButton>
                    </div>
                </form>
            )}

            {loading ? (
                <div className="text-zinc-400 text-[10px] italic text-center py-8">Loading repository...</div>
            ) : documents.length === 0 ? (
                <div className="text-zinc-400 text-[10px] italic text-center py-8">No documents uploaded yet.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((doc) => (
                        <div key={doc.id} className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-[12px] font-bold text-zinc-800 dark:text-zinc-200 truncate pr-4">{doc.title}</h4>
                                <span className="text-[9px] text-zinc-400 whitespace-nowrap">{new Date(doc.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-2 min-h-[2.5em]">
                                {doc.description || "No description provided."}
                            </p>
                            <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download / View
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
