import Tooltip from "./hover-tooltip"

type PriceInfoProps = {
  label: string;
  value: string;
  hover_value: string;
};
export default function PriceInfoFees(props: PriceInfoProps) {
  const { label, value, hover_value } = props;
  return (
    <div className="flex">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-s ml-auto">
        <Tooltip text={value} tooltipText={hover_value} />
      </span>
    </div>
  );
}