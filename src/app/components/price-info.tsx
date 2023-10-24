type PriceInfoProps = {
  label: string;
  value: string;
};

export default function PriceInfo(props: PriceInfoProps) {
  const { label, value } = props;

  return (
    <div className="flex">
      <span className="text-sm text-[#BCBCBD]">{label}</span>
      <span className="ml-auto text-xs">{value}</span>
    </div>
  );
}
