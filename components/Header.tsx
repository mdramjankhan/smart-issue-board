"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export function Header() {
    const { user, signOut } = useAuth();

    return (
        <header className="flex w-full flex-col gap-4 rounded-3xl bg-gradient-to-br from-white/90 via-zinc-50/90 to-white/80 p-5 sm:p-6 shadow-sm ring-1 ring-black/5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1 text-center sm:text-left">
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Smart Issue Board</p>
                <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900">Report issues, avoid duplicates, and track progress.</h1>
                <p className="text-sm text-zinc-600">Auth with Email/Password, Firestore Database</p>
            </div>
            <div className="flex w-full min-w-0 flex-col items-center gap-2 rounded-2xl bg-gradient-to-r from-zinc-100/95 via-white/80 to-zinc-100/95 px-4 py-3 text-sm text-zinc-700 shadow-inner sm:w-auto sm:flex-row sm:items-center sm:rounded-full sm:gap-3 sm:px-5">
                {user ? (
                    <>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 whitespace-nowrap">Signed in</span>
                        <span className="min-w-0 font-medium text-center sm:text-left sm:max-w-[260px] truncate">
                            {user.email}
                        </span>
                        <Button variant="secondary" className="w-full whitespace-nowrap px-4 py-2 sm:w-auto sm:min-w-[112px] sm:px-5 shadow-sm ring-1 ring-black/5" onClick={signOut}>
                            Log out
                        </Button>
                    </>
                ) : (
                    <div className="flex w-full items-center justify-center gap-2 sm:w-auto sm:justify-start sm:gap-3 ">
                        <span className="text-zinc-700 whitespace-nowrap">Not signed in</span>
                        <Link href="/auth" className="whitespace-nowrap rounded-full bg-white/70 px-3 py-1 text-sm font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-100 transition hover:bg-white">
                            Log in / Sign up
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
