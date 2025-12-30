"use client";

import { forwardRef, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-inner focus:border-indigo-500 focus:outline-none ${className}`.trim()}
    {...props}
  />
));

Input.displayName = "Input";

export { Input };
