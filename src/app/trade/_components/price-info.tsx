type PriceInfoProps = {
  label: string;
  value: string;
};
export default function PriceInfo(props: PriceInfoProps) {
  const { label, value } = props;
  return (
    <div className="flex">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-s ml-auto">{value}</span>
    </div>
  );
}