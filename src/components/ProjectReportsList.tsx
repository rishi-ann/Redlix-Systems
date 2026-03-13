"use client";

import { useEffect, useState } from "react";

interface Report {
    id: string;
    status: string;
    summary: string;
    documentUrl?: string;
    issueType: string;
    issueDescription?: string;
    createdAt: string;
    developer: { email: string };
}

export default function ProjectReportsList({ clientId }: { clientId: string }) {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReports() {
            try {
                const res = await fetch(`/api/developer/reports?clientId=${clientId}`);
                if (res.ok) {
                    setReports(await res.json());
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if (clientId) fetchReports();
    }, [clientId]);

    if (loading) return <div className="text-zinc-400 text-[10px] italic">Loading updates...</div>;
    if (reports.length === 0) return <div className="text-zinc-400 text-[10px] italic">No updates reported yet.</div>;

    return (
        <div className="space-y-4">
            {reports.map((report) => (
                <div key={report.id} className="p-4 rounded-xl bg-white/5 border border-zinc-100 dark:border-zinc-800">
                    <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest
                            ${report.status === "ON_TRACK" ? "bg-emerald-100 text-emerald-700" :
                                report.status === "DELAYED" ? "bg-amber-100 text-amber-700" :
                                    report.status === "BLOCKED" ? "bg-red-100 text-red-700" :
                                        "bg-blue-100 text-blue-700"}`}>
                            {report.status.replace("_", " ")}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                            {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-[12px] text-zinc-600 dark:text-zinc-300 mb-3 leading-relaxed">
                        {report.summary}
                    </p>

                    {report.documentUrl && (
                        <div className="mb-3">
                            <a href={report.documentUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-emerald-600 hover:text-emerald-700 underline flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                View Documentation
                            </a>
                        </div>
                    )}

                    {report.issueType !== "NONE" && (
                        <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                            <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">{report.issueType} ISSUE</span>
                            </div>
                            <p className="text-[11px] text-red-600/80">{report.issueDescription}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
