"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "../_lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    className={cn(
      "my- relative flex w-full touch-none select-none items-center",
      className,
    )}
    ref={ref}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[#1b1d22]">
      <SliderPrimitive.Range className="absolute h-full bg-[#25272E]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="ring-offset-background focus-visible:ring-ring block h-6 w-6 rounded-md border-2 border-[#363636] bg-[#0d0e11] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
