"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-indigo-300",
  secondary: "bg-zinc-900 text-white hover:bg-zinc-700 disabled:bg-zinc-400",
  ghost: "border border-zinc-200 bg-white text-zinc-800 hover:border-indigo-200",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", children, ...props }, ref) => (
    <button
      ref={ref}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed ${variants[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  ),
);

Button.displayName = "Button";

export { Button };
