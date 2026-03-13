"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Task {
    id: string;
    title: string;
    description?: string;
    status: string;
    demoLink?: string;
    createdAt: string;
    developer?: {
        email: string;
    };
}

export default function ClientTasksPage() {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTasks() {
            try {
                const res = await fetch("/api/client/tasks");
                if (res.ok) {
                    setTasks(await res.json());
                } else {
                    // router.push("/client/login");
                }
            } catch (error) {
                console.error("Failed to fetch tasks", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTasks();
    }, [router]);

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col selection:bg-emerald-100 font-sans">
            {/* Navbar - Replicated from Dashboard for consistency */}
            <nav className="w-full bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/50 px-4 sm:px-8 py-4">
                <div className="max-w-6xl mx-auto flex flex-row justify-between items-center gap-2">
                    <div
                        onClick={() => router.push('/')}
                        className="cursor-pointer flex items-center gap-1.5 sm:gap-2 font-mono text-[9px] sm:text-[11px] tracking-widest sm:tracking-[0.2em] text-emerald-700 dark:text-emerald-400 uppercase whitespace-nowrap"
                    >
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-500 rounded-full shrink-0" />
                        Client Node
                    </div>
                    <div className="flex gap-3 sm:gap-6 items-center overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => router.push('/client')}
                            className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-emerald-600 transition-colors whitespace-nowrap"
                        >
                            Dashboard
                        </button>
                        <button
                            className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 whitespace-nowrap"
                        >
                            Tasks
                        </button>
                        <button
                            onClick={() => router.push('/client/documents')}
                            className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-emerald-600 transition-colors whitespace-nowrap"
                        >
                            Docs
                        </button>
                        <button className="hidden sm:block text-[10px] font-normal uppercase tracking-wider text-emerald-700 dark:text-emerald-400 hover:opacity-70 transition-opacity whitespace-nowrap">
                            Support
                        </button>
                    </div>
                </div>
            </nav>

            <main className="flex-grow p-4 sm:p-8 lg:p-12">
                <div className="max-w-5xl mx-auto">
                    <header className="mb-8 sm:mb-12 text-center sm:text-left">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2 block">Project Activity</span>
                        <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                            Task <span className="text-emerald-600">Board</span>
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm max-w-sm mx-auto sm:mx-0 leading-relaxed">
                            Track the real-time progress of development tasks assigned to your team.
                        </p>
                    </header>

                    <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                        {loading ? (
                            <div className="p-12 text-center text-zinc-400 italic text-sm">Loading project tasks...</div>
                        ) : tasks.length === 0 ? (
                            <div className="p-12 text-center text-zinc-400 italic text-sm">No active tasks visible.</div>
                        ) : (
                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {tasks.map((task) => (
                                    <div key={task.id} className="p-5 sm:p-8 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                            <div className="w-full sm:w-auto">
                                                <div className="flex items-center flex-wrap gap-2 sm:gap-3 mb-2">
                                                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide truncate max-w-[200px] sm:max-w-none">
                                                        {task.title}
                                                    </h3>
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest
                                                        ${task.status === "PENDING" ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600" :
                                                            task.status === "IN_PROGRESS" ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600" :
                                                                task.status === "COMPLETED" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600" :
                                                                    "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>
                                                        {task.status.replace("_", " ")}
                                                    </span>
                                                </div>
                                                <div className="text-[9px] sm:text-[10px] text-zinc-400 font-mono flex flex-wrap gap-2 sm:gap-3">
                                                    <span className="truncate max-w-[80px] sm:max-w-none">ID: {task.id}</span>
                                                    <span>•</span>
                                                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                                                    {task.developer && (
                                                        <>
                                                            <span className="hidden sm:inline">•</span>
                                                            <span className="text-emerald-600 w-full sm:w-auto truncate sm:max-w-[150px]">{task.developer.email}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            {task.demoLink && (
                                                <a
                                                    href={task.demoLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2"
                                                >
                                                    View Demo
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
                                            )}
                                        </div>
                                        <p className="text-[12px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                            {task.description || "No specific details provided."}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
