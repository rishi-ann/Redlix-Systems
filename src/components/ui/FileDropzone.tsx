"use client";

import { useState, useRef } from "react";
import { Upload, File, X, AlertCircle } from "lucide-react";

interface FileDropzoneProps {
    onFileSelect: (file: File) => void;
    maxSizeMB?: number;
}

export default function FileDropzone({ onFileSelect, maxSizeMB = 3 }: FileDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const validateAndSelectFile = (file: File) => {
        setError(null);
        const maxSize = maxSizeMB * 1024 * 1024;

        if (file.size > maxSize) {
            setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
            return;
        }

        setSelectedFile(file);
        onFileSelect(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            validateAndSelectFile(file);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            validateAndSelectFile(file);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-4 w-full">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                    relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center text-center
                    ${isDragging
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-emerald-400 dark:hover:border-emerald-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/40"}
                `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInput}
                    className="hidden"
                />

                <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform
                    ${isDragging ? "scale-110 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:text-emerald-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30"}
                `}>
                    <Upload className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Drag & drop your file here
                    </ p>
                    <p className="text-xs text-zinc-500">
                        or click to browse from computer
                    </p>
                </div>

                <div className="mt-4 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-full">
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                        Max {maxSizeMB}MB
                    </p>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-xl animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-[11px] font-medium text-red-600">{error}</p>
                </div>
            )}

            {selectedFile && !error && (
                <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-xl animate-in fade-in slide-in-from-bottom-1">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-emerald-600">
                            <File className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[12px] font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">
                                {selectedFile.name}
                            </p>
                            <p className="text-[10px] text-zinc-500">
                                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            removeFile();
                        }}
                        className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
