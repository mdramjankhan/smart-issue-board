"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { CreateIssueForm } from "@/components/issues/CreateIssueForm";
import { IssueList } from "@/components/issues/IssueList";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/context/AuthContext";
import { listIssues, updateIssueStatus } from "@/lib/issues";
import { IssuePriority, IssueRecord, IssueStatus } from "@/types/issue";

const statusFilterOptions: Array<"All" | IssueStatus> = ["All", "Open", "In Progress", "Done"];
const priorityFilterOptions: Array<"All" | IssuePriority> = ["All", "Low", "Medium", "High"];

export default function Home() {
  const { user, initializing } = useAuth();
  const [issues, setIssues] = useState<IssueRecord[]>([]);
  const [issueLoading, setIssueLoading] = useState(false);
  const [filters, setFilters] = useState({ status: "All", priority: "All" });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [statusBusy, setStatusBusy] = useState<string | null>(null);

  const statusFilter = useMemo(
    () => (filters.status === "All" ? undefined : (filters.status as IssueStatus)),
    [filters.status],
  );

  const priorityFilter = useMemo(
    () => (filters.priority === "All" ? undefined : (filters.priority as IssuePriority)),
    [filters.priority],
  );

  const fetchIssues = useCallback(async () => {
    if (!user) return;
    setIssueLoading(true);
    try {
      const data = await listIssues({ status: statusFilter, priority: priorityFilter });
      setIssues(data);
      setFeedback(null);
    } catch {
      setFeedback("Failed to load issues. Please retry.");
    } finally {
      setIssueLoading(false);
    }
  }, [priorityFilter, statusFilter, user]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const handleStatusChange = async (issue: IssueRecord, nextStatus: IssueStatus) => {
    setStatusBusy(issue.id);
    try {
      await updateIssueStatus(issue.id, nextStatus);
      setFeedback("Status updated.");
      await fetchIssues();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not change status.";
      setFeedback(message);
    } finally {
      setStatusBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <Header />

        {feedback && (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
            {feedback}
          </div>
        )}

        {initializing ? (
          <div className="rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur text-sm text-zinc-600">
            Checking session...
          </div>
        ) : user ? (
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
            <CreateIssueForm onCreated={fetchIssues} onFeedback={setFeedback} />

            <div className="rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-zinc-900">Issues</h2>
                <div className="flex gap-2 text-sm text-zinc-700">
                  <label className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-2">
                    Status
                    <Select
                      value={filters.status}
                      onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                      className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm focus:border-indigo-500 focus:outline-none"
                    >
                      {statusFilterOptions.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </Select>
                  </label>
                  <label className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-2">
                    Priority
                    <Select
                      value={filters.priority}
                      onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
                      className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm focus:border-indigo-500 focus:outline-none"
                    >
                      {priorityFilterOptions.map((priority) => (
                        <option key={priority}>{priority}</option>
                      ))}
                    </Select>
                  </label>
                </div>
              </div>

              <IssueList
                issues={issues}
                loading={issueLoading}
                onStatusChange={handleStatusChange}
                statusBusyId={statusBusy}
              />
            </div>
          </section>
        ) : (
          <section className="rounded-3xl bg-white/90 p-8 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <h2 className="text-2xl font-semibold text-zinc-900">You need to sign in</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Create an account or log in to create and manage issues.
            </p>
            <div className="mt-4 flex gap-3 text-sm">
              <Link
                href="/auth"
                className="rounded-full bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-500"
              >
                Log in
              </Link>
              <Link
                href="/auth?mode=signup"
                className="rounded-full bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-500"
              >
                Create account
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
