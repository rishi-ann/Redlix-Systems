"use client";

import { useState, useEffect } from "react";
import { AuthInput } from "@/components/ui/AuthInput";
import { AuthButton } from "@/components/ui/AuthButton";
import FileDropzone from "@/components/ui/FileDropzone";
import { FileText, Download, Trash2, Loader2 } from "lucide-react";

interface ClientDocument {
    id: string;
    title: string;
    url: string;
    size?: number;
    type?: string;
    description?: string;
    createdAt: string;
}

export default function ClientDocuments() {
    const [documents, setDocuments] = useState<ClientDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        title: "",
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
        if (!selectedFile) return;

        setUploading(true);
        try {
            // 1. Read file as base64
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    // Remove data:application/pdf;base64, etc.
                    const base64String = result.split(',')[1];
                    resolve(base64String);
                };
                reader.onerror = reject;
                reader.readAsDataURL(selectedFile);
            });

            // 2. Save to Database via API
            const res = await fetch("/api/client/documents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.title,
                    size: selectedFile.size,
                    type: selectedFile.type,
                    description: formData.description,
                    content: base64
                })
            });

            if (res.ok) {
                setFormData({ title: "", description: "" });
                setSelectedFile(null);
                setShowForm(false);
                fetchDocuments();
            } else {
                const errorText = await res.text();
                throw new Error(errorText || "Upload failed");
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed: " + (error instanceof Error ? error.message : "Unknown error"));
        } finally {
            setUploading(false);
        }
    }

    const formatSize = (bytes?: number) => {
        if (!bytes) return "0 Bytes";
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-8 mt-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <FileText className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-zinc-900 dark:text-zinc-100 text-[12px] font-bold uppercase tracking-widest">Project Documents</h3>
                        <p className="text-zinc-400 text-[10px]">Upload resources and view files shared with your repository.</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2"
                >
                    {showForm ? "Cancel" : "Upload Document"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleUpload} className="mb-8 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block">Document Title</label>
                            <AuthInput
                                placeholder="e.g. Q1 Project Assets"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="bg-white dark:bg-zinc-950 h-10 text-[13px] border-zinc-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block">File Node</label>
                            <FileDropzone onFileSelect={setSelectedFile} maxSizeMB={3} />
                        </div>

                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block">Context (Optional)</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={2}
                                placeholder="Brief context about this file..."
                                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-[13px] focus:outline-none focus:border-emerald-500 transition-colors resize-none placeholder:text-zinc-400"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <AuthButton
                                loading={uploading}
                                disabled={!selectedFile}
                                className="w-auto px-8 h-11 text-[11px]"
                            >
                                Initiate Secure Transfer
                            </AuthButton>
                        </div>
                    </div>
                </form>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Loader2 className="w-5 h-5 text-zinc-300 animate-spin" />
                    <p className="text-zinc-400 text-[10px] italic">Accessing repository nodes...</p>
                </div>
            ) : documents.length === 0 ? (
                <div className="text-zinc-400 text-[10px] italic text-center py-12 border-2 border-dashed border-zinc-50 dark:border-zinc-900 rounded-2xl">
                    Repository is currently empty.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((doc) => (
                        <div key={doc.id} className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all duration-300 group bg-white dark:bg-zinc-900/20">
                            <div className="flex justify-between items-start mb-3">
                                <div className="space-y-1">
                                    <h4 className="text-[13px] font-bold text-zinc-800 dark:text-zinc-100 truncate pr-4">{doc.title}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-md font-mono">
                                            {formatSize(doc.size)}
                                        </span>
                                        <span className="text-[9px] text-zinc-400">
                                            {new Date(doc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-8 h-8 bg-zinc-50 dark:bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-300 group-hover:text-emerald-500 transition-colors border border-zinc-100 dark:border-zinc-800">
                                    <FileText className="w-4 h-4" />
                                </div>
                            </div>

                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2 min-h-[2.5em] leading-relaxed">
                                {doc.description || "No context provided for this asset."}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-zinc-50 dark:border-zinc-800/50">
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Access File
                                </a>
                                <div className="text-[9px] text-zinc-300 dark:text-zinc-600 font-mono uppercase">
                                    {doc.type?.split('/')[1] || 'DOC'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

