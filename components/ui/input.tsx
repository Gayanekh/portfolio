import * as React from "react";

import { cn } from "@/lib/utils";

// Shared field surface, after Dribbble's inputs: 0.5rem radius and a 1px
// border whose colour alone signals state (no shadows or rings), so nothing
// shifts. Focus is darker than hover to stay clear for keyboard users. Error,
// disabled and read-only states stay distinct. Height, spacing and typography
// are left to each usage.
export const inputClassName = cn(
  "rounded-[0.5rem] border border-[rgb(219_218_222/0.9)] bg-white shadow-none outline-none",
  "transition-[color,background-color,border-color] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
  "hover:border-[rgb(158_158_167/0.7)]",
  "focus:border-muted-foreground",
  "aria-[invalid=true]:border-destructive",
  "read-only:bg-card",
  "disabled:cursor-not-allowed disabled:bg-card disabled:text-muted-foreground disabled:hover:border-[rgb(219_218_222/0.9)]",
);

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(inputClassName, className)} {...props} />
  ),
);
Input.displayName = "Input";

export { Input };
