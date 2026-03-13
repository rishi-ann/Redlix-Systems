"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { AuthInput } from "@/components/ui/AuthInput";
import { AuthButton } from "@/components/ui/AuthButton";

interface Client {
    id: string;
    name: string;
    contactName?: string;
    email?: string;
    mobile?: string;
    startDate?: string;
    endDate?: string;
    totalBudget?: string;
    amountPaid?: string;
    developers: { id: string, email: string }[];
    createdAt: string;
}

interface Developer {
    id: string;
    email: string;
}

export default function AdminClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [developerIds, setDeveloperIds] = useState<string[]>([]); // Multi-select state
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(""); // Track original ID for updates

    // Form State

    // Form State
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        contactName: "",
        email: "",
        mobile: "",
        startDate: "",
        endDate: "",
        totalBudget: "",
        amountPaid: "",
        developerId: ""
    });

    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState("");

    async function fetchData() {
        try {
            const [clientsRes, devsRes] = await Promise.all([
                fetch("/api/admin/clients"),
                fetch("/api/admin/developers")
            ]);

            if (clientsRes.ok) {
                setClients(await clientsRes.json());
            }
            if (devsRes.ok) {
                setDevelopers(await devsRes.json());
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setCreateLoading(true);
        setCreateError("");

        try {
            const url = isEditing ? `/api/admin/clients` : "/api/admin/clients"; // PUT to base URL with body
            const method = isEditing ? "PUT" : "POST";

            // If editing, we need to send both the original ID (to find the record) and the new ID (if changed)
            // But formData.id is likely holding the *current* input value.
            // We need to store the *original* ID somewhere to know what to update.
            // Ah, I need a new state for 'originalId' or similar.
            // Let's assume formData.id is the NEW id.
            // But the API expects { id: originalId, newId: newId ... }
            // So I need to modify how I call the API.

            // Wait, I need to store the original ID when entering edit mode.
            // Let's use a ref or state for 'editingId'.
            // Actually, I can just cheat and say: passing `id` as the ORIGINAL id, and `newId` as the formData.id?
            // No, formData.id is bound to the input.

            // Let's add 'editingId' state to the component.
            // I'll do that in a separate edit step. For now, let's assume I fix the request body construction using a hypothetical 'editingId'.

            /* 
               Better approach: 
               Modify handleSubmit to use a persistent 'editingId' state that I will add.
            */

            const body = isEditing ? {
                ...formData,
                id: editingId, // The ID of the record we are updating (original)
                newId: formData.id, // The potentially new ID from input
                developerIds // Include the multi-select state
            } : {
                ...formData,
                developerIds // Include the multi-select state
            };

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                resetForm();
                fetchData();
            } else {
                setCreateError(isEditing ? "Failed to update client" : "Failed to create client");
            }
        } catch (error) {
            setCreateError("Connection error");
        } finally {
            setCreateLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this client? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/admin/clients/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchData();
            } else {
                alert("Failed to delete client");
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    }

    function handleEdit(client: Client) {
        setFormData({
            id: client.id,
            name: client.name,
            contactName: client.contactName || "",
            email: client.email || "",
            mobile: client.mobile || "",
            startDate: client.startDate ? new Date(client.startDate).toISOString().split('T')[0] : "",
            endDate: client.endDate ? new Date(client.endDate).toISOString().split('T')[0] : "",
            totalBudget: client.totalBudget || "",
            amountPaid: client.amountPaid || "",
            developerId: "" // Not used for single select anymore, handled by developerIds
        });
        // Populate multi-select state
        setDeveloperIds(client.developers ? client.developers.map((d: any) => d.id) : []);
        setEditingId(client.id);
        setIsEditing(true);
        setIsCreating(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function resetForm() {
        setFormData({
            id: "",
            name: "",
            contactName: "",
            email: "",
            mobile: "",
            startDate: "",
            endDate: "",
            totalBudget: "",
            amountPaid: "",
            developerId: ""
        });
        setDeveloperIds([]);
        setIsCreating(false);
        setIsEditing(false);
        setEditingId("");
        setCreateError("");
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans selection:bg-emerald-100">
            <AdminSidebar />

            <main className="flex-1 ml-64 p-12">
                <header className="mb-16 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                            Client <span className="text-emerald-600">Registry</span>
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-normal">
                            Manage partner entities, contact details, and project timelines.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            if (isCreating) {
                                resetForm();
                            } else {
                                setIsCreating(true);
                            }
                        }}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-normal uppercase tracking-[0.2em] rounded-lg transition-all"
                    >
                        {isCreating ? "Cancel" : "Add New Entity"}
                    </button>
                </header>

                {isCreating && (
                    <div className="mb-12 bg-zinc-50 dark:bg-zinc-900/40 p-8 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 animate-in fade-in slide-in-from-top-4">
                        <h3 className="text-zinc-900 dark:text-zinc-100 text-[11px] font-bold uppercase tracking-widest mb-6">
                            {isEditing ? `Edit Client: ${formData.id}` : "New Client Configuration"}
                        </h3>
                        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Company Details */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold mb-2">Company Information</h4>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block">Client ID</label>
                                        <AuthInput
                                            value={formData.id}
                                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                            disabled={!isEditing} // Only editable in edit mode (or creating if manual ID allowed, but usually auto-generated)
                                            // Actually user wants to update it, so enable it in edit mode.
                                            // But for create it is auto-generated.
                                            // Let's allow editing only when isEditing is true?
                                            // Wait, for create it is empty and auto-generated.
                                            // For edit, it is populated.
                                            // So validation: 
                                            // If creating: disabled (auto-gen)
                                            // If editing: enabled
                                            readOnly={!isEditing}
                                            className={`bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-10 text-[12px] font-mono ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            placeholder={isEditing ? "RED-XXXX" : "Auto-generated"}
                                        />
                                        {isEditing && <p className="text-[9px] text-amber-500 mt-1">Warning: Changing ID updates all linked records.</p>}
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block">Company Name</label>
                                        <AuthInput
                                            placeholder="e.g. Acme Corp"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-10 text-[12px]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block">Contact Person</label>
                                        <AuthInput
                                            placeholder="Full Name"
                                            value={formData.contactName}
                                            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                            className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-10 text-[12px]"
                                        />
                                    </div>
                                </div>

                                {/* Contact Details */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold mb-2">Contact Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block">Mobile Number</label>
                                            <AuthInput
                                                placeholder="+1 (555) 000-0000"
                                                value={formData.mobile}
                                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-10 text-[12px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block">Email Address</label>
                                            <AuthInput
                                                type="email"
                                                placeholder="contact@company.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-10 text-[12px]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Project Timeline */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold mb-2">Project Timeline</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block">Start Date</label>
                                            <input
                                                type="date"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg h-10 px-3 text-[12px] focus:outline-none focus:border-emerald-500 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block">Completion Date</label>
                                            <input
                                                type="date"
                                                value={formData.endDate}
                                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg h-10 px-3 text-[12px] focus:outline-none focus:border-emerald-500 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Financials & Assignment */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold mb-2">Financials & Allocation</h4>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block">Total Budget (₹)</label>
                                            <AuthInput
                                                type="number"
                                                placeholder="0.00"
                                                value={formData.totalBudget}
                                                onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
                                                className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-10 text-[12px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block">Initial Payment (₹)</label>
                                            <AuthInput
                                                type="number"
                                                placeholder="0.00"
                                                value={formData.amountPaid}
                                                onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                                                className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-10 text-[12px]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 block">Assign Developers</label>
                                        <div className="grid grid-cols-1 gap-2 p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg max-h-40 overflow-y-auto">
                                            {developers.map((dev) => (
                                                <label key={dev.id} className="flex items-center gap-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 p-1 rounded">
                                                    <input
                                                        type="checkbox"
                                                        value={dev.id}
                                                        checked={developerIds.includes(dev.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setDeveloperIds([...developerIds, dev.id]);
                                                            } else {
                                                                setDeveloperIds(developerIds.filter(id => id !== dev.id));
                                                            }
                                                        }}
                                                        className="w-3.5 h-3.5 text-emerald-600 rounded border-zinc-300 focus:ring-emerald-500"
                                                    />
                                                    <span className="text-[11px] text-zinc-700 dark:text-zinc-300">{dev.email}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <p className="text-[9px] text-zinc-400 mt-1">Select multiple developers for this project team.</p>
                                    </div>
                                </div>
                            </div>

                            {createError && (
                                <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-[11px]">
                                    {createError}
                                </div>
                            )}

                            <div className="pt-4 flex justify-end">
                                <AuthButton
                                    loading={createLoading}
                                    className="px-8 bg-zinc-900 dark:bg-zinc-100 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white dark:text-zinc-900 text-[10px] font-normal uppercase tracking-widest h-10 rounded-lg transition-colors border-none"
                                >
                                    {isEditing ? "Update Entity" : "Register Entity"}
                                </AuthButton>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="p-12 text-center text-zinc-400 italic text-sm">Scanning client database...</div>
                    ) : clients.length === 0 ? (
                        <div className="p-12 text-center text-zinc-400 italic text-sm">No registered entities found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                                    <tr>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">ID</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Company</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Contact</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Timeline</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Developer</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {clients.map((client) => (
                                        <tr key={client.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors group">
                                            <td className="px-6 py-5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">{client.id}</td>
                                            <td className="px-6 py-5">
                                                <div className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100">{client.name}</div>
                                                {client.email && <div className="text-[10px] text-zinc-400 mt-1">{client.email}</div>}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-[12px] text-zinc-700 dark:text-zinc-300">{client.contactName || "-"}</div>
                                                {client.mobile && <div className="text-[10px] text-zinc-400 mt-1">{client.mobile}</div>}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1 text-[10px] font-mono text-zinc-500">
                                                    {client.startDate && <span>Start: {new Date(client.startDate).toLocaleDateString()}</span>}
                                                    {client.endDate && <span>End: {new Date(client.endDate).toLocaleDateString()}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-[11px] text-zinc-500 dark:text-zinc-400">
                                                {client.developers && client.developers.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {client.developers.map((dev: any, index: number) => (
                                                            <span key={dev.id || index} className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded border border-emerald-100 dark:border-emerald-900/50">
                                                                {dev.email}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-zinc-300 dark:text-zinc-600 italic">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(client)}
                                                        className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-full transition-colors"
                                                        title="Edit Client"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(client.id)}
                                                        className="p-2 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full transition-colors"
                                                        title="Delete Client"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
