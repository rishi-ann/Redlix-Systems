import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col selection:bg-emerald-100 font-sans text-zinc-900 dark:text-zinc-100">
            {/* Navbar */}
            <nav className="z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/80 px-8 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <img src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770405388/icon-removebg-preview_v3cxkb.png" alt="Logo" className="h-6 w-6" />
                        <span className="text-sm font-normal tracking-[0.2em] uppercase">CSAPP<span className="text-zinc-400">.</span></span>
                    </Link>
                    <Link href="/" className="text-[10px] font-normal uppercase tracking-widest text-zinc-400 hover:text-emerald-600 transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-3 h-3" /> Back to Home
                    </Link>
                </div>
            </nav>

            <main className="flex-grow max-w-4xl mx-auto px-8 py-20 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <header className="mb-16">
                    <h1 className="text-4xl font-light tracking-tight mb-4">
                        Terms of <span className="text-emerald-600">Service</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-normal uppercase tracking-[0.2em]">
                        Last Updated: February 2026
                    </p>
                </header>

                <div className="space-y-12 text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                    <section className="space-y-4">
                        <h2 className="text-xl font-normal text-zinc-900 dark:text-zinc-100 tracking-tight">01. Acceptance of Terms</h2>
                        <p>
                            By accessing the CSAPP Nexus (Portal), you agree to comply with these terms of governance. Our services are provided as-is, designed for high-precision digital management.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-normal text-zinc-900 dark:text-zinc-100 tracking-tight">02. Node Usage</h2>
                        <p>
                            Users are responsible for the activities performed under their developer or client identifier. Misuse of the infrastructure, including unauthorized penetration testing or resource abuse, will result in immediate node deactivation.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-normal text-zinc-900 dark:text-zinc-100 tracking-tight">03. Intellect & Assets</h2>
                        <p>
                            The CSAPP architecture, including its visual logic and technical pipelines, remains the exclusive property of Redlix Studio. System components may not be replicated or redistributed without written authorization.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-normal text-zinc-900 dark:text-zinc-100 tracking-tight">04. Limitation of Liability</h2>
                        <p>
                            Redlix Studio shall not be liable for system downtime or data disruption caused by external provider failure (e.g., cloud environment outages). We strive for 99.9% architectural uptime.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-normal text-zinc-900 dark:text-zinc-100 tracking-tight">05. Governing Law</h2>
                        <p>
                            These terms are governed by the digital standards of modern internet commerce and the specific administrative laws of our operational registry.
                        </p>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full bg-emerald-600 dark:bg-emerald-500 py-12 text-black mt-20">
                <div className="max-w-6xl mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
                            <span className="text-[10px] font-normal tracking-[0.2em] uppercase text-black">CSAPP Precision</span>
                        </div>
                        <p className="text-xs font-light text-black/80">
                            Architectural management for modern workflows.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
