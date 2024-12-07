type PriceInfoEditPositionProps = {
  label: string;
  value_before: string;
  value_after?: string; // Rendu optionnel
};

export default function PriceInfoEditPosition(
  props: PriceInfoEditPositionProps,
) {
  const { label, value_before, value_after } = props;

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="ml-auto flex items-center space-x-1">
        <span className="text-sm text-gray-400">{value_before}</span>
        {value_after && (
          <>
            <span className="text-sm text-gray-300">{"->"}</span>
            <span className="text-sm font-semibold text-yellow-400">
              {value_after}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
