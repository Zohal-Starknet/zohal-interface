import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../_lib/utils";

export const buttonVariants = cva(
  "text-normal inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-md font-normal ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-10 px-4 py-2",
        icon: "h-10 w-10",
        lg: "h-11 px-8",
        sm: "h-9 px-3",
      },

      variant: {
        danger:
          "dark:white dark:hover:brightness-80 bg-btn-danger text-white hover:brightness-110 dark:bg-btn-danger dark:text-white",
        default:
          "dark:hover:brightness-80 bg-btn-primary text-white hover:brightness-110 dark:bg-btn-primary dark:text-white",
        ghost:
          "dark:hover:brightness-80 text-slate-900 hover:brightness-110 dark:text-slate-50",
        link: "text-slate-900 underline-offset-4 hover:brightness-110 dark:text-slate-50",
        outline:
          "dark:hover:brightness-80 border border-slate-200 bg-white text-slate-900 hover:brightness-110 dark:border-slate-800 dark:bg-slate-950",
        secondary:
          "dark:hover:brightness-80 bg-secondary text-white hover:brightness-110 dark:bg-secondary dark:text-white",
        success:
          "dark:hover:brightness-80 bg-btn-success text-white hover:brightness-110 dark:bg-btn-success dark:text-white",
      },
    },
  },
);

export type ButtonProps = {
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export default React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const { asChild = false, className, size, variant, ...buttonProps } = props;
    const Component = asChild ? Slot : "button";

    return (
      <Component
        className={cn(buttonVariants({ className, size, variant }))}
        ref={ref}
        {...buttonProps}
      />
    );
  },
);
