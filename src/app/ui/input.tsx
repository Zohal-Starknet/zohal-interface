// TODO - Handle state
type Props = {
  id?: string;
  placeholder: string;
};

// TODO: Add type in props
export default function Input(props: Props) {
  const { id, placeholder } = props;
  return (
    <input
      className="appearance-none bg-transparent text-lg outline-none"
      id={id}
      inputMode="decimal"
      placeholder={placeholder}
    />
  );
}
