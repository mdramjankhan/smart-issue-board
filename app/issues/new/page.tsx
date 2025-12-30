"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateIssueForm } from "@/components/issues/CreateIssueForm";
import { Header } from "@/components/Header";
import { useAuth } from "@/context/AuthContext";

export default function NewIssuePage() {
    const { user, initializing } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!initializing && !user) {
            router.replace("/auth");
        }
    }, [initializing, router, user]);

    return (
        <div className="min-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-10">
            <div className="mx-auto flex max-w-4xl flex-col gap-6">
                <Header />
                <CreateIssueForm onCreated={() => router.push("/")} />
            </div>
        </div>
    );
}
