"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/context/AuthContext";
import { createIssue, findSimilarIssues, SimilarIssue } from "@/lib/issues";
import { IssuePriority } from "@/types/issue";

interface CreateIssueFormProps {
    onCreated?: () => Promise<void> | void;
    onFeedback?: (message: string) => void;
}

const priorityOptions: IssuePriority[] = ["Low", "Medium", "High"];

export function CreateIssueForm({ onCreated, onFeedback }: CreateIssueFormProps) {
    const { user } = useAuth();
    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "Medium" as IssuePriority,
        assignedTo: "",
    });
    const [creating, setCreating] = useState(false);
    const [similarMatches, setSimilarMatches] = useState<SimilarIssue[]>([]);
    const [confirmAfterSimilar, setConfirmAfterSimilar] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const pushMessage = (text: string) => {
        setMessage(text);
        onFeedback?.(text);
    };

    const resetSimilarity = () => {
        setSimilarMatches([]);
        setConfirmAfterSimilar(false);
    };

    const handleCreate = async (forceCreate: boolean) => {
        if (!user) {
            pushMessage("Please sign in before creating issues.");
            return;
        }
        if (!form.title.trim() || !form.description.trim()) {
            pushMessage("Title and description cannot be empty.");
            return;
        }

        setCreating(true);
        try {
            if (!forceCreate) {
                const matches = await findSimilarIssues({ title: form.title, description: form.description });
                if (matches.length) {
                    setSimilarMatches(matches);
                    setConfirmAfterSimilar(true);
                    pushMessage("We found similar issues. Confirm to create anyway.");
                    setCreating(false);
                    return;
                }
            }

            await createIssue({ ...form, createdBy: user.email ?? "unknown" });
            setForm({ title: "", description: "", priority: "Medium", assignedTo: "" });
            resetSimilarity();
            pushMessage("Issue created and stored in Firestore.");
            await onCreated?.();
        } catch (err: unknown) {
            const text = err instanceof Error ? err.message : "Could not create issue. Try again.";
            pushMessage(text);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-zinc-900">Create issue</h2>
                <span className="text-xs text-zinc-500">Default status: Open</span>
            </div>
            <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-2 text-sm text-zinc-700">
                    Title
                    <Input
                        value={form.title}
                        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Short, clear title"
                    />
                </label>
                <label className="flex flex-col gap-2 text-sm text-zinc-700">
                    Description
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                        className="min-h-[120px] w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-inner focus:border-indigo-500 focus:outline-none"
                        placeholder="What is happening? Steps, expected vs actual, context."
                    />
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm text-zinc-700">
                        Priority
                        <Select
                            value={form.priority}
                            onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value as IssuePriority }))}
                        >
                            {priorityOptions.map((priority) => (
                                <option key={priority}>{priority}</option>
                            ))}
                        </Select>
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-zinc-700">
                        Assigned to (optional)
                        <Input
                            value={form.assignedTo}
                            onChange={(e) => setForm((prev) => ({ ...prev, assignedTo: e.target.value }))}
                            placeholder="owner@team.com"
                        />
                    </label>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-500">Similarity check runs before saving.</p>
                    <div className="flex gap-2">
                        <Button onClick={() => handleCreate(false)} disabled={creating}>
                            {creating ? "Saving..." : "Create issue"}
                        </Button>
                        {confirmAfterSimilar && (
                            <Button
                                variant="ghost"
                                onClick={() => handleCreate(true)}
                                className="border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200"
                            >
                                Confirm anyway
                            </Button>
                        )}
                    </div>
                </div>
                {similarMatches.length > 0 && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                        <div className="mb-2 font-semibold">Similar issues found</div>
                        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                            {similarMatches.map(({ issue, score }) => (
                                <div key={issue.id} className="rounded-xl bg-white/80 px-3 py-2 shadow-inner">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-zinc-900">{issue.title}</p>
                                        <span className="text-xs text-zinc-500">Score {(score * 100).toFixed(0)}%</span>
                                    </div>
                                    <p className="text-xs text-zinc-600 max-h-12 overflow-hidden text-ellipsis">{issue.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {message && (
                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
