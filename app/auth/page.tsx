"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { Header } from "@/components/Header";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-10 text-sm text-zinc-600">Loading auth...</div>}>
      <AuthPageInner />
    </Suspense>
  );
}

function AuthPageInner() {
  const { user, initializing } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultMode = useMemo(() => (searchParams.get("mode") === "signup" ? "signup" : "login"), [searchParams]);
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);

  useEffect(() => {
    if (!initializing && user) {
      router.replace("/");
    }
  }, [initializing, router, user]);

  return (
    <div className="min-h-screen  py-10 px-4 sm:px-6 lg:px-10">
      <div className=" mx-auto flex max-w-5xl flex-col gap-6">
        <Header />
        <AuthForm mode={mode} onToggleMode={setMode} onSuccess={() => router.replace("/")} />
      </div>
    </div>
  );
}
