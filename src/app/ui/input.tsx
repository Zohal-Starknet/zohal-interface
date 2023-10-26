// TODO - Handle state
type Props = {
  id?: string;
  onChange: (newValue: string) => void;
  placeholder: string;
  value: string;
};

// TODO: Add type in props
export default function Input(props: Props) {
  const { id, onChange, placeholder, value } = props;
  return (
    <input
      className="appearance-none bg-transparent text-lg outline-none"
      id={id}
      inputMode="decimal"
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      value={value}
    />
  );
}
