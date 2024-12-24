import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@ui/lib/utils";

interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  variant?: "thick" | "normal" | "thin";
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    {
      className,
      orientation = "horizontal",
      variant = "normal",
      decorative = true,
      ...props
    },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal"
          ? variant === "normal"
            ? "h-0.5 w-full"
            : variant === "thick"
              ? "h-1 w-full"
              : "h-px w-full"
          : variant === "normal"
            ? "w-0.5 min-h-full"
            : variant === "thick"
              ? "w-1 min-h-full"
              : "w-px min-h-full",
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
