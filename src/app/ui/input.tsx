// TODO - Handle state
type Props = {
  id?: string;
  placeholder: string;
  value: string;
  onChange: (newValue: string) => void;
};

export default function Input(props: Props) {
  const { id, placeholder, value, onChange } = props;
  return (
    <input
      id={id}
      className="bg-transparent appearance-none outline-none text-lg"
      type="number"
      inputMode="decimal"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
