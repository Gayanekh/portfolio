import * as React from "react";

import { inputClassName } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(inputClassName, className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
