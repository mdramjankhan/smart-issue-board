"use client";

import { IssueRecord, IssueStatus } from "@/types/issue";
import { StatusSelect } from "./StatusSelect";

interface IssueItemProps {
    issue: IssueRecord;
    onStatusChange: (issue: IssueRecord, next: IssueStatus) => void;
    busy?: boolean;
}

const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);

export function IssueItem({ issue, onStatusChange, busy }: IssueItemProps) {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900">{issue.title}</h3>
                    <p className="text-sm text-zinc-600">{issue.description}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-800" title="Priority">
                        {issue.priority}
                    </span>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800" title="Status">
                        {issue.status}
                    </span>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-600">
                <div className="flex flex-col gap-1">
                    <span>Assigned to: {issue.assignedTo || "Unassigned"}</span>
                    <span>Created by: {issue.createdBy}</span>
                    <span>Created: {formatDate(issue.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-500">Change status</span>
                    <StatusSelect value={issue.status} onChange={(next) => onStatusChange(issue, next)} disabled={busy} />
                    {busy && <span className="text-[11px] text-indigo-600">Saving...</span>}
                </div>
            </div>
        </div>
    );
}
