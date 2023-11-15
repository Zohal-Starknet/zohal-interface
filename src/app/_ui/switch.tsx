import * as RadixSwitch from "@radix-ui/react-switch";

type SwitchProps = {
  /** Is the switch toggled */
  checked: boolean;
  /** Function called when the switch is toggled */
  onCheckedChange: (checked: boolean) => void;
};

export default function Switch(props: SwitchProps) {
  const { checked, onCheckedChange } = props;

  return (
    <RadixSwitch.Root
      checked={checked}
      className="h-[1.125rem] w-[1.875rem] cursor-pointer rounded-full bg-[#BBA5FF4D] data-[state=checked]:bg-[#BBA5FFD9]"
      onCheckedChange={onCheckedChange}
    >
      <RadixSwitch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px_rgba(0,0,0,0.3)] transition-transform will-change-transform data-[state=checked]:translate-x-[13px]" />
    </RadixSwitch.Root>
  );
}
