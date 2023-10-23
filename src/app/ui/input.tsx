// TODO - Handle state
type Props = {
  id?: string;
};

export default function Input(props: Props) {
  const { id } = props;
  return (
    <input
      className="appearance-none bg-transparent text-lg outline-none"
      id={id}
      inputMode="decimal"
      placeholder="0.0"
      type="number"
    />
  );
}
