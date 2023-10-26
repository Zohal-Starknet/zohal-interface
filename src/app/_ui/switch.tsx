import * as RadixSwitch from "@radix-ui/react-switch";

export default function Switch() {
  return (
    <RadixSwitch.Root className="h-[1.125rem] w-[1.875rem] cursor-pointer rounded-full bg-[#BBA5FF4D] data-[state=checked]:bg-[#BBA5FFD9]">
      <RadixSwitch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px_rgba(0,0,0,0.3)] transition-transform will-change-transform data-[state=checked]:translate-x-[13px]" />
    </RadixSwitch.Root>
  );
}
