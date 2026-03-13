import React from "react";

export function AuthInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={`w-full px-5 py-3.5 rounded-none transition-all duration-300 font-medium border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 placeholder:text-zinc-400 ${props.className || ""}`}
        />
    );
}
