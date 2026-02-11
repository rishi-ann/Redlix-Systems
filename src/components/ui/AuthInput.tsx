import React from "react";

export function AuthInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={`w-full px-5 py-3.5 rounded-xl transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${props.className || ""}`}
        />
    );
}
