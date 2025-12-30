import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Issue Board",
  description: "Lightweight issue board with Firebase auth and Firestore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-100/80 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.14),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(129,140,248,0.12),transparent_30%)]`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
