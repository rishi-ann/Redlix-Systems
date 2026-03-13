"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";

interface Report {
    id: string;
    status: string;
    summary: string;
    documentUrl?: string;
    issueType: string;
    issueDescription?: string;
    createdAt: string;
    client: { name: string };
    developer: { email: string };
}

export default function AdminReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReports() {
            try {
                const res = await fetch("/api/admin/reports");
                if (res.ok) {
                    setReports(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch reports", error);
            } finally {
                setLoading(false);
            }
        }
        fetchReports();
    }, []);

    return (
        <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans selection:bg-emerald-100">
            <AdminSidebar />

            <main className="flex-1 ml-64 p-12">
                <header className="mb-16">
                    <h1 className="text-2xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                        Project <span className="text-emerald-600">Reports</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs font-normal">
                        Global status feed from all active developer nodes.
                    </p>
                </header>

                <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="p-12 text-center text-zinc-400 italic text-sm">Synchronizing report feed...</div>
                    ) : reports.length === 0 ? (
                        <div className="p-12 text-center text-zinc-400 italic text-sm">No reports submitted yet.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                                    <tr>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Date</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Project / Developer</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Status</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Summary</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Issues</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {reports.map((report) => (
                                        <tr key={report.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors group">
                                            <td className="px-6 py-5 text-[11px] font-mono text-zinc-500">
                                                {new Date(report.createdAt).toLocaleDateString()}
                                                <div className="text-[9px] text-zinc-400">{new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-[13px] font-medium text-emerald-600 dark:text-emerald-400">{report.client.name}</div>
                                                <div className="text-[10px] text-zinc-400 mt-0.5">{report.developer.email}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest
                                                    ${report.status === "ON_TRACK" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600" :
                                                        report.status === "DELAYED" ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600" :
                                                            report.status === "BLOCKED" ? "bg-red-50 dark:bg-red-950/30 text-red-600" :
                                                                "bg-blue-50 dark:bg-blue-950/30 text-blue-600"}`}>
                                                    {report.status.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-[11px] text-zinc-600 dark:text-zinc-300 max-w-xs line-clamp-2" title={report.summary}>
                                                    {report.summary}
                                                </p>
                                                {report.documentUrl && (
                                                    <a href={report.documentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-1 text-[9px] text-emerald-500 hover:text-emerald-600 underline">
                                                        View Data
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                {report.issueType !== "NONE" ? (
                                                    <div className="flex items-center gap-1.5 text-red-500">
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                        </svg>
                                                        <span className="text-[10px] font-bold">{report.issueType}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-zinc-300 dark:text-zinc-700 text-[10px]">—</span>
                                                )}
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
