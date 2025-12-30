"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { signIn, signOutUser, signUp } from "@/lib/auth";

interface AuthContextValue {
    user: User | null;
    initializing: boolean;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (current) => {
            setUser(current);
            setInitializing(false);
        });
        return () => unsubscribe();
    }, []);

    const value = useMemo(
        () => ({
            user,
            initializing,
            signInWithEmail: (email: string, password: string) => signIn(email, password),
            signUpWithEmail: (email: string, password: string) => signUp(email, password),
            signOut: () => signOutUser(),
        }),
        [user, initializing],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
