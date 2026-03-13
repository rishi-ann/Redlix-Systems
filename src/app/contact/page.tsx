"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthInput } from "@/components/ui/AuthInput";
import { AuthButton } from "@/components/ui/AuthButton";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle2, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, subject, message }),
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
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 font-sans text-zinc-900">
                <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-red-100 flex items-center justify-center mx-auto rounded-none">
                        <CheckCircle2 className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight">Message Received</h1>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            Thank you for your inquiry. Our team has received your message and will get back to you within 24 hours.
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
        <div className="min-h-screen bg-white flex flex-col font-sans text-zinc-900">
            {/* Navbar */}
            <nav className="z-50 w-full border-b border-red-700 bg-red-600/90 backdrop-blur-xl shadow-sm">
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
                                <span className="text-[10px] font-semibold tracking-wider text-zinc-400">Support Hub</span>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-light tracking-tight leading-tight">
                                Get in touch with <span className="text-red-600">us.</span>
                            </h1>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-md">
                                Have a question? We are here to help and talk about your project or any other needs.
                            </p>
                        </div>

                        {/* Process Steps */}
                        <div className="space-y-6 border-l border-zinc-100 pl-8">
                            {[
                                { id: "01", title: "We Review", desc: "We read your message and understand what you need." },
                                { id: "02", title: "We Respond", desc: "We send you a clear and helpful reply within 24 hours." }
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

                        {/* Quick Contact */}
                        <div className="pt-6 space-y-4 border-l border-zinc-100 pl-8">
                            <div className="flex items-center gap-3 text-sm text-zinc-500 font-medium">
                                <Mail className="w-4 h-4 text-red-600" />
                                <span>hello@redlix.studio</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-zinc-500 font-medium">
                                <MapPin className="w-4 h-4 text-red-600" />
                                <span>Global Operations Hub</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="lg:col-span-7">
                        <div className="bg-white border border-zinc-100 p-8 lg:p-10 rounded-none shadow-sm">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-2.5">
                                        <label className="text-[10px] font-bold tracking-wider text-red-600 uppercase">Your Name</label>
                                        <AuthInput
                                            placeholder="John Smith"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="h-12 border-zinc-400 bg-white"
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-[10px] font-bold tracking-wider text-red-600 uppercase">Email Address</label>
                                        <AuthInput
                                            type="email"
                                            placeholder="john@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="h-12 border-zinc-400 bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-bold tracking-wider text-red-600 uppercase">Subject</label>
                                    <AuthInput
                                        placeholder="What is this regarding?"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        required
                                        className="h-12 border-zinc-400 bg-white"
                                    />
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-bold tracking-wider text-red-600 uppercase">Message</label>
                                    <textarea
                                        placeholder="How can we help you today?"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        className="w-full h-32 p-4 text-sm bg-white border border-zinc-400 rounded-none outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 transition-all resize-none font-medium text-zinc-900 placeholder:text-zinc-400"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold tracking-wide h-14 rounded-none transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/10 disabled:opacity-50"
                                >
                                    <span>Send Message</span>
                                    {loading ? (
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-3.5 h-3.5" />
                                    )}
                                </button>

                                {error && <p className="text-center text-red-500 text-xs mt-2 font-medium">{error}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {/* Signature Redlix Studio Footer */}
            <footer className="w-full bg-red-600 py-12 lg:py-20 text-white border-t border-red-500/30">
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
