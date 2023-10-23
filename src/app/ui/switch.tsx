import * as RadixSwitch from "@radix-ui/react-switch";

export default function Switch() {
  return (
    <RadixSwitch.Root className="w-[1.875rem] h-[1.125rem] bg-[#BBA5FF4D] rounded-full cursor-pointer data-[state=checked]:bg-[#BBA5FFD9]">
      <RadixSwitch.Thumb className="block w-4 h-4 rounded-full bg-white shadow-[0_2px_2px_rgba(0,0,0,0.3)] transition-transform translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[13px]" />
    </RadixSwitch.Root>
  );
}
