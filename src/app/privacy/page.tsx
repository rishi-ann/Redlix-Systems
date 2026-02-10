import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
                        Privacy <span className="text-emerald-600">Policy</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-normal uppercase tracking-[0.2em]">
                        Last Updated: February 2026
                    </p>
                </header>

                <div className="space-y-12 text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                    <section className="space-y-4">
                        <h2 className="text-xl font-normal text-zinc-900 dark:text-zinc-100 tracking-tight">01. Overview</h2>
                        <p>
                            CSAPP acts as a nexus for digital architectural management. We are committed to protecting the integrity of the data that flows through our infrastructure. This policy outlines how we handle data synchronization and resident identity.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-normal text-zinc-900 dark:text-zinc-100 tracking-tight">02. Information Acquisition</h2>
                        <p>
                            When you initialize a node on our network (via signup or Google sync), we store your primary registry email and a unique system identifier. This is necessary to maintain the security of the developer and client portals.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-normal text-zinc-900 dark:text-zinc-100 tracking-tight">03. Data Security</h2>
                        <p>
                            We employ architectural-grade encryption for all data at rest and in transit. Access to portal environments is restricted via multi-layered session validation and OAuth 2.0 protocols.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-normal text-zinc-900 dark:text-zinc-100 tracking-tight">04. Third-Party Integration</h2>
                        <p>
                            Our system utilizes Google OAuth for seamless synchronization. Data shared with Google is governed by their independent security protocols. We do not sell registry data to external entities.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-normal text-zinc-900 dark:text-zinc-100 tracking-tight">05. Contact</h2>
                        <p>
                            For inquiries regarding data governance or system access, please contact our core support team at <span className="text-emerald-600">support@csapp.com</span>.
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
