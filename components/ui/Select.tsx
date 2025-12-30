"use client";

import { forwardRef, SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className = "", children, ...props }, ref) => (
  <select
    ref={ref}
    className={`rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-inner focus:border-indigo-500 focus:outline-none ${className}`.trim()}
    {...props}
  >
    {children}
  </select>
));

Select.displayName = "Select";

export { Select };
