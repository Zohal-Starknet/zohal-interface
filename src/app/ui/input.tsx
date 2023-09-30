// TODO - Handle state
type Props = {
  id?: string;
};

export default function Input(props: Props) {
  const { id } = props;
  return (
    <input
      id={id}
      className="bg-transparent appearance-none outline-none text-lg"
      type="number"
      inputMode="decimal"
      placeholder="0.0"
    />
  );
}
