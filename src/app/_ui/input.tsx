import clsx from "clsx";

// TODO - Handle state
type Props = {
  className?: string;
  id?: string;
  onChange: (newValue: string) => void;
  placeholder: string;
  value: string;
};

// TODO: Add type in props
export default function Input(props: Props) {
  const { className, id, onChange, placeholder, value } = props;
  return (
    <input
      className={clsx(
        "appearance-none bg-transparent text-lg outline-none",
        className,
      )}
      id={id}
      inputMode="decimal"
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      value={value}
    />
  );
}
