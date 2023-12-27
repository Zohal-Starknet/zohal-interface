import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../_lib/utils";

export const buttonVariants = cva(
  "text-normal inline-flex items-center justify-center whitespace-nowrap rounded-md font-normal ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
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
          "dark:white bg-btn-danger text-white hover:bg-btn-danger dark:bg-btn-danger dark:text-white dark:hover:bg-btn-danger/90",
        default:
          "bg-btn-primary text-white hover:bg-btn-primary dark:bg-btn-primary dark:text-white dark:hover:bg-btn-primary/90",
        ghost:
          "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
        outline:
          "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        secondary:
          "bg-[#1d1f23] text-white hover:bg-[#1d1f23] dark:bg-[#1d1f23] dark:text-white dark:hover:bg-[#1d1f23]",
        success:
          "bg-btn-success text-white hover:bg-btn-success dark:bg-btn-success dark:text-white dark:hover:bg-btn-success/90",
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
