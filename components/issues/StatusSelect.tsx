"use client";

import { Select } from "@/components/ui/Select";
import { IssueStatus } from "@/types/issue";

interface StatusSelectProps {
    value: IssueStatus;
    onChange: (value: IssueStatus) => void;
    disabled?: boolean;
}

const statusOptions: IssueStatus[] = ["Open", "In Progress", "Done"];

export function StatusSelect({ value, onChange, disabled }: StatusSelectProps) {
    return (
        <Select
            value={value}
            onChange={(e) => onChange(e.target.value as IssueStatus)}
            disabled={disabled}
            className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm focus:border-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-100"
        >
            {statusOptions.map((status) => (
                <option key={status}>{status}</option>
            ))}
        </Select>
    );
}
