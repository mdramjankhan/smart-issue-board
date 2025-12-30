import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth } from "./firebase";

export async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password);
}

export async function signOutUser() {
    await signOut(auth);
}
