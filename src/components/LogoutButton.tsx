"use client";

export default function LogoutButton() {
    async function logout() {
        await fetch("/api/developer/logout", { method: "POST" });
        window.location.href = "/developer/login";
    }

    return (
        <button
            onClick={logout}
            className="px-6 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium text-[11px] uppercase tracking-widest rounded-lg hover:border-emerald-200 dark:hover:border-emerald-900 transition-all font-sans"
        >
            Logout
        </button>
    );
}
