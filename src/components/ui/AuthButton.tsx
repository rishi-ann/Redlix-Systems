import React from "react";

export function AuthButton({
    loading,
    disabled,
    children,
    onClick,
    className,
    type = "submit",
}: {
    loading?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: "submit" | "button" | "reset";
}) {
    const isActuallyDisabled = loading || disabled;
    return (
        <button
            type={type}
            disabled={isActuallyDisabled}
            onClick={onClick}
            className={`flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className || ""}`}
        >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing
                </span>
            ) : children}
        </button>
    );
}
