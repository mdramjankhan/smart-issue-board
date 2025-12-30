"use client";

import { IssueRecord, IssueStatus } from "@/types/issue";
import { IssueItem } from "./IssueItem";

interface IssueListProps {
    issues: IssueRecord[];
    loading?: boolean;
    statusBusyId?: string | null;
    onStatusChange: (issue: IssueRecord, next: IssueStatus) => void;
}

export function IssueList({ issues, loading, statusBusyId, onStatusChange }: IssueListProps) {
    if (loading) {
        return <div className="flex items-center justify-center py-10 text-sm text-zinc-500">Loading issues...</div>;
    }

    if (issues.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-10 text-center text-sm text-zinc-500">
                No issues yet. Create one to get started.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {issues.map((issue) => (
                <IssueItem
                    key={issue.id}
                    issue={issue}
                    onStatusChange={onStatusChange}
                    busy={statusBusyId === issue.id}
                />
            ))}
        </div>
    );
}
