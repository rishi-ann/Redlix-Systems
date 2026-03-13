"use client";

import { useEffect, useState } from "react";
import DeveloperSidebar from "@/components/layout/DeveloperSidebar";

interface Task {
    id: string;
    title: string;
    description?: string;
    status: string;
    demoLink?: string;
    createdAt: string;
}

export default function DeveloperTasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTasks() {
            try {
                const res = await fetch("/api/developer/tasks");
                if (res.ok) {
                    setTasks(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch tasks", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTasks();
    }, []);

    return (
        <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans selection:bg-emerald-100">
            <DeveloperSidebar />

            <main className="flex-1 ml-64 p-12">
                <header className="mb-16">
                    <h1 className="text-2xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                        Task <span className="text-emerald-600">Center</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs font-normal">
                        Directives and assignments from the central administration.
                    </p>
                </header>

                <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="p-12 text-center text-zinc-400 italic text-sm">Syncing directives...</div>
                    ) : tasks.length === 0 ? (
                        <div className="p-12 text-center text-zinc-400 italic text-sm">No active directives found.</div>
                    ) : (
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {tasks.map((task) => (
                                <div key={task.id} className="p-8 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                                                    {task.title}
                                                </h3>
                                                <select
                                                    value={task.status}
                                                    onChange={async (e) => {
                                                        const newStatus = e.target.value;
                                                        // Optimistic update
                                                        setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));

                                                        try {
                                                            const res = await fetch("/api/developer/tasks", {
                                                                method: "PATCH",
                                                                headers: { "Content-Type": "application/json" },
                                                                body: JSON.stringify({ taskId: task.id, status: newStatus }),
                                                            });
                                                            if (!res.ok) {
                                                                // Revert on failure
                                                                setTasks(tasks);
                                                                alert("Failed to update status");
                                                            }
                                                        } catch (error) {
                                                            setTasks(tasks);
                                                            alert("Connection error");
                                                        }
                                                    }}
                                                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border-none focus:ring-0 cursor-pointer
                                                    ${task.status === "PENDING" ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600" :
                                                            task.status === "IN_PROGRESS" ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600" :
                                                                task.status === "COMPLETED" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600" :
                                                                    "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="IN_PROGRESS">In Progress</option>
                                                    <option value="COMPLETED">Completed</option>
                                                    <option value="BLOCKED">Blocked</option>
                                                </select>
                                            </div>
                                            <div className="text-[10px] text-zinc-400 font-mono">
                                                ID: {task.id} • Issued: {new Date(task.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        {task.demoLink && (
                                            <a
                                                href={task.demoLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                View Demo
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-[12px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                        {task.description || "No parameters specified."}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
