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
    {/* Track with right-to-left gold gradient background */}
    <SliderPrimitive.Track
      className="relative h-2 w-full grow overflow-hidden rounded-full"
      style={{
        background:
          "linear-gradient(270deg, rgba(255, 215, 0, 1), rgba(254, 232, 111, 1))",
      }}
    >
      {/* Range with a slightly darker gold color, also right-to-left */}
      <SliderPrimitive.Range
        className="absolute h-full"
        style={{
          background:
            "linear-gradient(270deg, rgba(254, 232, 111, 1), rgba(218, 165, 32, 1))",
        }}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-6 w-6 rounded-md border-2 border-border bg-slate-900 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;
export { Slider };
