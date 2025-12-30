"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

interface AuthFormProps {
  mode?: "login" | "signup";
  onToggleMode?: (next: "login" | "signup") => void;
  onSuccess?: () => void;
}

export function AuthForm({ mode = "login", onToggleMode, onSuccess }: AuthFormProps) {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      setMessage("Email and password are required.");
      return;
    }

    setBusy(true);
    setMessage(null);
    try {
      if (mode === "login") {
        await signInWithEmail(form.email, form.password);
        setMessage("Welcome back.");
      } else {
        await signUpWithEmail(form.email, form.password);
        setMessage("Account created. You are signed in.");
      }
      onSuccess?.();
    } catch (err: unknown) {
      const text = err instanceof Error ? err.message : "Authentication failed. Please try again.";
      setMessage(text);
    } finally {
      setBusy(false);
    }
  };

  const toggle = () => {
    const next = mode === "login" ? "signup" : "login";
    onToggleMode?.(next);
  };

  return (
    <div className="rounded-3xl bg-white/90 p-5 sm:p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-zinc-900">
          {mode === "login" ? "Log in to manage issues" : "Create an account"}
        </h2>
        <button
          className="text-sm font-medium text-indigo-600 underline self-start sm:self-auto"
          onClick={toggle}
        >
          {mode === "login" ? "Need an account?" : "Have an account?"}
        </button>
      </div>
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm text-zinc-700">
          Email
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Your email address"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-zinc-700">
          Password
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="At least 6 characters"
          />
        </label>
        <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500">Email/password uses Firebase Authentication.</p>
          <Button type="submit" disabled={busy} variant="secondary" className="w-full sm:w-auto">
            {busy ? "Working..." : mode === "login" ? "Log in" : "Sign up"}
          </Button>
        </div>
      </form>
      {message && (
        <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          {message}
        </div>
      )}
    </div>
  );
}
