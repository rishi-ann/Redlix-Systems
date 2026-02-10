"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import DeveloperSidebar from "@/components/layout/DeveloperSidebar";
import { AuthInput } from "@/components/ui/AuthInput";
import { AuthButton } from "@/components/ui/AuthButton";

export default function SubmitReportPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        status: "ON_TRACK",
        summary: "",
        documentUrl: "",
        issueType: "NONE",
        issueDescription: ""
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/developer/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientId: id,
                    ...formData
                }),
            });

            if (res.ok) {
                router.push("/developer/clients");
            } else {
                const txt = await res.text();
                setError(txt || "Failed to submit report");
            }
        } catch (err) {
            setError("Connection failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans selection:bg-emerald-100">
            <DeveloperSidebar />

            <main className="flex-1 ml-64 p-12">
                <header className="mb-12">
                    <button
                        onClick={() => router.back()}
                        className="text-zinc-400 hover:text-emerald-600 text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2 transition-colors"
                    >
                        ← Back to Clients
                    </button>
                    <h1 className="text-2xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                        Submit <span className="text-emerald-600">Progress Report</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs font-normal">
                        Update stakeholders on project status and key deliverables.
                    </p>
                </header>

                <div className="max-w-2xl bg-zinc-50 dark:bg-zinc-900/40 p-8 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Status Selection */}
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Current Status</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {["ON_TRACK", "DELAYED", "COMPLETED", "BLOCKED"].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status: s })}
                                        className={`px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all
                                            ${formData.status === s
                                                ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20"
                                                : "bg-white dark:bg-zinc-950 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-emerald-300"
                                            }`}
                                    >
                                        {s.replace("_", " ")}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Progress Summary</label>
                            <textarea
                                value={formData.summary}
                                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                required
                                rows={4}
                                placeholder="Describe completed tasks, milestones achieved, and next steps..."
                                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 text-[12px] focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                            />
                        </div>

                        {/* Documentation */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Documentation URL (Optional)</label>
                            <AuthInput
                                placeholder="https://docs.google.com/..."
                                value={formData.documentUrl}
                                onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
                                className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-10 text-[12px]"
                            />
                        </div>

                        {/* Issues */}
                        <div className="space-y-4 p-4 rounded-xl bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-red-400 font-bold">Report Issue / Blocker</label>
                                <select
                                    value={formData.issueType}
                                    onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                                    className="w-full bg-white dark:bg-zinc-950 border border-red-200 dark:border-red-900/50 rounded-lg h-10 px-3 text-[12px] focus:outline-none focus:border-red-500 transition-colors"
                                >
                                    <option value="NONE">No Issues</option>
                                    <option value="TECHNICAL">Technical Limitation</option>
                                    <option value="BLOCKER">Critical Blocker</option>
                                    <option value="RESOURCE">Resource Constraint</option>
                                </select>
                            </div>

                            {formData.issueType !== "NONE" && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <textarea
                                        value={formData.issueDescription}
                                        onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                                        rows={2}
                                        placeholder="Describe the issue in detail..."
                                        className="w-full bg-white dark:bg-zinc-950 border border-red-200 dark:border-red-900/50 rounded-lg p-3 text-[12px] focus:outline-none focus:border-red-500 transition-colors resize-none"
                                    />
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="text-red-500 text-[11px] bg-red-50 p-3 rounded-lg">{error}</div>
                        )}

                        <div className="flex justify-end pt-4">
                            <AuthButton
                                loading={loading}
                                className="px-8 bg-zinc-900 dark:bg-zinc-100 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white dark:text-zinc-900 text-[10px] font-normal uppercase tracking-widest h-10 rounded-lg transition-colors border-none"
                            >
                                Submit Report
                            </AuthButton>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
