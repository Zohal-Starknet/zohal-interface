import clsx from "clsx";
import { cn } from "../_lib/utils";
// TODO - Handle state
type Props = {
  className?: string;
  id?: string;
  onChange: (newValue: string) => void;
  placeholder: string;
  value: string;
  disabled: boolean;
};

// TODO: Add type in props
export default function Input(props: Props) {
  const { className, id, onChange, placeholder, value, disabled } = props;
  return (
    <input
      autoComplete="off"
      className={cn("appearance-none text-lg outline-none", className)}
      id={id}
      inputMode="decimal"
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
    />
  );
}
