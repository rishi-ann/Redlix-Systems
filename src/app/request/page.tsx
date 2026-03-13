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
            <div className="min-h-screen bg-white dark:bg-white flex flex-col items-center justify-center p-8 font-sans text-zinc-900 dark:text-zinc-900">
                <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-100 flex items-center justify-center mx-auto rounded-none">
                        <CheckCircle2 className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight">Request Sent</h1>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            Thank you. We have received your project details and will contact you soon.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="px-8 py-3 bg-red-600 text-white text-xs font-semibold tracking-wide rounded-none transition-all hover:bg-red-700"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-white flex flex-col font-sans text-zinc-900 dark:text-zinc-900">
            {/* Navbar */}
            <nav className="z-50 w-full border-b border-red-700 bg-red-600/90 backdrop-blur-xl dark:border-red-700 dark:bg-red-600/90 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 flex h-20 justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <img src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-13_at_21.00.59-removebg-preview.png" alt="Logo" className="h-10 w-auto brightness-0 invert" />
                    </Link>
                    <Link href="/" className="px-5 py-2.5 bg-white text-xs font-semibold tracking-wide text-red-600 transition-all hover:bg-zinc-100 flex items-center gap-2 rounded-none">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back Home
                    </Link>
                </div>
            </nav>

            <main className="flex-grow flex items-center justify-center px-6 py-16 lg:py-24">
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                    {/* Left Side Content */}
                    <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-32">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2.5">
                                <span className="h-1.5 w-1.5 bg-red-600" />
                                <span className="text-[10px] font-semibold tracking-wider text-zinc-400">Project Inquiry</span>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-light tracking-tight leading-tight">
                                Build your project with <span className="text-red-600">ease.</span>
                            </h1>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-md">
                                Tell us about your project. We build fast and reliable digital tools for your business.
                            </p>
                        </div>

                        <div className="space-y-6 border-l border-zinc-100 pl-8">
                            {[
                                { id: "01", title: "Review", desc: "We talk about what you need and what you want to build." },
                                { id: "02", title: "Plan", desc: "We make a clear plan to build and grow your project." }
                            ].map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="flex-none w-8 h-8 bg-red-50 flex items-center justify-center text-xs font-semibold text-red-600">{item.id}</div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-sm font-semibold">{item.title}</h3>
                                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="lg:col-span-7">
                        <div className="bg-white dark:bg-white border border-zinc-100 p-8 lg:p-10 rounded-none shadow-sm">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-2.5">
                                        <label className="text-[10px] font-bold tracking-wider text-red-600 uppercase">Full Name</label>
                                        <AuthInput
                                            placeholder="Jane Doe"
                                            value={clientName}
                                            onChange={(e) => setClientName(e.target.value)}
                                            required
                                            className="h-12 border-zinc-400 bg-white"
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-[10px] font-bold tracking-wider text-red-600 uppercase">Email Address</label>
                                        <AuthInput
                                            type="email"
                                            placeholder="jane@example.com"
                                            value={clientEmail}
                                            onChange={(e) => setClientEmail(e.target.value)}
                                            required
                                            className="h-12 border-zinc-400 bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-bold tracking-wider text-red-600 uppercase">Project Title</label>
                                    <AuthInput
                                        placeholder="Mobile App, Dashboard, etc."
                                        value={projectTitle}
                                        onChange={(e) => setProjectTitle(e.target.value)}
                                        required
                                        className="h-12 border-zinc-400 bg-white"
                                    />
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-bold tracking-wider text-red-600 uppercase">Project Description</label>
                                    <textarea
                                        placeholder="Describe the core features..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                        className="w-full h-32 p-4 text-sm bg-white border border-zinc-400 rounded-none outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 transition-all resize-none font-medium text-zinc-900 placeholder:text-zinc-400"
                                    />
                                </div>

                                {/* Budget Dropdown */}
                                <div className="space-y-2.5 relative">
                                    <label className="text-[10px] font-bold tracking-wider text-red-600 uppercase">Estimated Budget (INR)</label>
                                    <div className="relative">
                                        <select
                                            value={budget}
                                            onChange={(e) => setBudget(e.target.value)}
                                            required
                                            className="w-full h-12 px-4 text-sm bg-white border border-zinc-400 rounded-none outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 transition-all appearance-none cursor-pointer font-medium text-zinc-900"
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

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold tracking-wide h-14 rounded-none transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/10 disabled:opacity-50"
                                >
                                    <span>Send Request</span>
                                    {loading ? (
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Rocket className="w-3.5 h-3.5" />
                                    )}
                                </button>

                                {error && <p className="text-center text-red-500 text-xs mt-2 font-medium">{error}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {/* Signature Redlix Studio Footer: Updated to high-performance sharp aesthetic */}
            <footer className="w-full bg-red-600 dark:bg-red-600 py-12 lg:py-20 text-white border-t border-red-500/30">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-10">
                        <div className="flex flex-col items-center sm:items-start">
                            <div className="flex items-center gap-2.5 mb-3">
                                <span className="h-2 w-2 bg-white animate-pulse" />
                                <span className="text-xs font-semibold tracking-wider text-white">CSAPP Precision</span>
                            </div>
                            <p className="text-sm font-medium text-white/70 text-center sm:text-left max-w-md">
                                Elegant and simple tools for modern teams and high-performance projects.
                            </p>
                        </div>

                        <div className="flex gap-10 text-xs font-semibold tracking-wide text-white/60">
                            <Link href="/privacy" className="hover:text-white transition-all hover:translate-y-[-1px]">Privacy</Link>
                            <Link href="/terms" className="hover:text-white transition-all hover:translate-y-[-1px]">Terms</Link>
                            <span className="cursor-default text-white/40">© {new Date().getFullYear()} Redlix</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}