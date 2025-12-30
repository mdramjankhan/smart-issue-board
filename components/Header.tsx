"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export function Header() {
    const { user, signOut } = useAuth();

    return (
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Smart Issue Board</p>
                <h1 className="text-3xl font-semibold text-zinc-900">Report issues, avoid duplicates, and track progress.</h1>
                <p className="text-sm text-zinc-600">Auth with Email/Password, Firestore Database</p>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-zinc-100 px-4 py-2 text-sm text-zinc-700">
                {user ? (
                    <>
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">Signed in</span>
                        <span className="font-medium">{user.email}</span>
                        <Button variant="secondary" className="px-3" onClick={signOut}>
                            Log out
                        </Button>
                    </>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-600">Not signed in</span>
                        <Link href="/auth" className="text-indigo-600 underline">
                            Log in / Sign up
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
