"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

const portals = [
  {
    id: "01",
    name: "Developer portal",
    description: "Access technical environments, pipelines, and architecture tools.",
    href: "/developer/login",
    tag: "Infrastructure"
  },
  {
    id: "02",
    name: "Client portal",
    description: "Monitor milestones, manage active bookings, and billing.",
    href: "/client/login",
    tag: "Collaboration"
  },
  {
    id: "03",
    name: "Administrator",
    description: "Global configuration, user moderation, and security controls.",
    href: "/admin/login",
    tag: "Governance"
  }
];

export default function Home() {
  return (
    /* h-screen + overflow-hidden locks the page to the viewport */
    <div className="h-screen w-screen bg-white dark:bg-zinc-950 flex flex-col overflow-hidden transition-colors duration-500">

      {/* Navbar: Redlix Slim Rail */}
      <nav className="z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <a href="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770405388/icon-removebg-preview_v3cxkb.png" target="_blank" rel="noopener noreferrer" className="mr-2">
                <img src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770405388/icon-removebg-preview_v3cxkb.png" alt="External Logo" className="h-6 w-6" />
              </a>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-normal tracking-[0.2em] text-zinc-900 dark:text-white uppercase leading-none">
                CSAPP<span className="text-zinc-400">.</span>
              </span>
            </div>
            <div className="flex gap-6 items-center">
              <a href="/request" className="text-[10px] font-normal uppercase tracking-wider text-zinc-400 hover:text-emerald-600 transition-opacity">
                New Request
              </a>
              <a href="/contact" className="rounded-full bg-emerald-600 px-4 py-1.5 text-[10px] font-normal uppercase tracking-widest text-white transition-colors hover:bg-emerald-500">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content: Internal Scroll only if needed */}
      <main className="flex-1 overflow-hidden flex flex-col justify-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">

          {/* Hero Section */}
          <div className="mb-12 max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-normal text-zinc-400">Management portal</span>
            </div>
            <h1 className="text-4xl font-light tracking-tighter text-zinc-900 dark:text-white sm:text-6xl lg:text-7xl leading-tight">
              Workflow <span className="text-emerald-600 dark:text-emerald-400">simplified</span>.
            </h1>
            <p className="mt-4 text-base font-normal leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-xl">
              A minimalist ecosystem designed for <span className="text-emerald-600 dark:text-emerald-400">clarity</span> and
              precision in modern digital administration.
            </p>
          </div>

          {/* Portal Selection: Scrollable list internally on small screens */}
          <div className="border-t border-zinc-100 dark:border-zinc-900 overflow-y-auto no-scrollbar max-h-[45vh] lg:max-h-none">
            {portals.map((portal) => (
              <div
                key={portal.id}
                className="group relative border-b border-zinc-100 py-6 transition-all duration-500 hover:bg-zinc-50/50 dark:border-zinc-900 dark:hover:bg-zinc-900/20 lg:py-10"
              >
                <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-12 lg:gap-0">
                  <div className="lg:col-span-1 hidden lg:block">
                    <span className="text-2xl font-extralight tracking-tighter text-zinc-200 dark:text-zinc-800 transition-colors group-hover:text-emerald-500/40">
                      {portal.id}
                    </span>
                  </div>

                  <div className="lg:col-span-4">
                    <p className="mb-1 text-[9px] font-normal uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                      {portal.tag}
                    </p>
                    <h2 className="text-xl font-light tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
                      {portal.name}
                    </h2>
                  </div>

                  <div className="lg:col-span-5 hidden sm:block">
                    <p className="text-sm font-normal leading-relaxed text-zinc-500 dark:text-zinc-400 lg:pr-10">
                      {portal.description}
                    </p>
                  </div>

                  <div className="flex justify-start lg:col-span-2 lg:justify-end">
                    <a
                      href={portal.href}
                      className="group/btn flex items-center gap-3 rounded-full border border-zinc-100 py-1 pl-5 pr-1 text-[11px] font-normal text-zinc-900 transition-all hover:bg-zinc-900 hover:text-white dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-white dark:hover:text-black"
                    >
                      Enter
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-white transition-transform duration-500 group-hover/btn:rotate-[360deg] dark:bg-black/10 dark:text-white dark:group-hover:bg-black dark:group-hover:text-white">
                        <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Signature Emerald Studio Footer: Fixed at the bottom */}
      <footer className="w-full bg-emerald-600 dark:bg-emerald-500 py-8 text-black lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
                <span className="text-[10px] font-normal tracking-[0.2em] uppercase text-black">CSAPP Precision</span>
              </div>
              <p className="text-xs font-light text-black/80 text-center sm:text-left">
                Architectural management for modern workflows.
              </p>
            </div>

            <div className="flex gap-8 text-[10px] font-normal uppercase tracking-widest text-black/70">
              <a href="/privacy" className="hover:text-black transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-black transition-colors">Terms</a>
              <span className="cursor-default">© {new Date().getFullYear()} Redlix</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}