"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthInput } from "@/components/ui/AuthInput";
import { AuthButton } from "@/components/ui/AuthButton";
import Link from "next/link";
import { ArrowLeft, Rocket, CheckCircle2, ChevronDown } from "lucide-react";

export default function ProjectRequestPage() {
    const router = useRouter();
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [projectTitle, setProjectTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ clientName, clientEmail, projectTitle, description, budget }),
            });

            if (res.ok) {
                setSuccess(true);
            } else {
                setError(await res.text());
            }
        } catch (err) {
            setError("Connection failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-8 font-sans text-zinc-900 dark:text-zinc-100">
                <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight">Proposal Received</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                            Thank you for reaching out. Our team will review your project details and get back to you shortly.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="px-8 py-3 bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all hover:bg-emerald-700"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col font-sans text-zinc-900 dark:text-zinc-100">
            {/* Navbar */}
            <nav className="z-50 w-full border-b border-zinc-100 dark:border-zinc-900 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <img src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770405388/icon-removebg-preview_v3cxkb.png" alt="Logo" className="h-5 w-5" />
                        <span className="text-xs font-bold tracking-[0.2em] uppercase">CSAPP</span>
                    </Link>
                    <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-emerald-600 transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-3 h-3" /> Back
                    </Link>
                </div>
            </nav>

            <main className="flex-grow flex items-center justify-center px-6 py-16 lg:py-24">
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                    {/* Left Side Content */}
                    <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-32">
                        <div className="space-y-4">
                            <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.3em]">Project Inquiry</span>
                            <h1 className="text-4xl lg:text-5xl font-medium tracking-tight leading-tight">
                                Launch your project with <span className="text-emerald-600">Expertise.</span>
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed max-w-md">
                                Fill out the form to start your technical journey. We specialize in high-performance architecture and modern digital solutions.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { id: "01", title: "Technical Audit", desc: "We review your goals and technical constraints." },
                                { id: "02", title: "Strategic Plan", desc: "A tailored roadmap for development and scaling." }
                            ].map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="flex-none w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-600">{item.id}</div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-sm font-semibold">{item.title}</h3>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Side - Emerald Styled Card */}
                    <div className="lg:col-span-7">
                        <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/50 p-8 lg:p-10 rounded-3xl shadow-sm">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">Full Name</label>
                                        <AuthInput
                                            placeholder="Jane Doe"
                                            value={clientName}
                                            onChange={(e) => setClientName(e.target.value)}
                                            required
                                            className="h-11 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">Email Address</label>
                                        <AuthInput
                                            type="email"
                                            placeholder="jane@example.com"
                                            value={clientEmail}
                                            onChange={(e) => setClientEmail(e.target.value)}
                                            required
                                            className="h-11 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">Project Title</label>
                                    <AuthInput
                                        placeholder="Mobile App, Dashboard, etc."
                                        value={projectTitle}
                                        onChange={(e) => setProjectTitle(e.target.value)}
                                        required
                                        className="h-11 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">Project Description</label>
                                    <textarea
                                        placeholder="Describe the core features and objectives..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                        className="w-full h-32 p-4 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none placeholder:text-zinc-400"
                                    />
                                </div>

                                {/* Budget Dropdown with Rupees */}
                                <div className="space-y-2 relative">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">Estimated Budget (INR)</label>
                                    <div className="relative">
                                        <select
                                            value={budget}
                                            onChange={(e) => setBudget(e.target.value)}
                                            required
                                            className="w-full h-11 px-4 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>Select a budget range</option>
                                            <option value="5k-10k">₹5,000 — ₹10,000</option>
                                            <option value="15k-25k">₹15,000 — ₹25,000</option>
                                            <option value="30k-50k">₹30,000 — ₹50,000</option>
                                            <option value="50k-1l">₹50,000 — ₹1,00,000 (1L)</option>
                                            <option value="1l+">₹1,00,000+ (1L+)</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                                    </div>
                                </div>

                                <AuthButton
                                    loading={loading}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-[0.2em] h-12 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10"
                                >
                                    <span>Send Proposal</span>
                                    {!loading && <Rocket className="w-3.5 h-3.5" />}
                                </AuthButton>

                                {error && <p className="text-center text-red-500 text-xs mt-2">{error}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-zinc-100 dark:border-zinc-900 py-10 bg-white dark:bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">CSAPP Engineering</p>
                        <p className="text-xs text-zinc-500">© {new Date().getFullYear()} Redlix. Built with precision.</p>
                    </div>
                    <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        <Link href="/privacy" className="hover:text-emerald-600 transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-emerald-600 transition-colors">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}