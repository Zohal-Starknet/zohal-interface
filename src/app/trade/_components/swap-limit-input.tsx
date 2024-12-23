import Input from "@zohal/app/_ui/input";
import { PropsWithChildren } from "react";
import { usePrices } from "../_hooks/use-market-data";

type SwapLimitInputProps = {
  /** Formatted balance of the current token */
  formattedTokenBalance?: string;
  /** Id used in htmlFor label and input id */
  id: string;
  /** Current value of the input */
  inputValue: string;
  /** Label used in the swap input */
  label: string;
  /** Function called on input change */
  payTokenSymbol: string;
  receiveTokenSymbol: string;
  onInputChange: (newInputValue: string) => void;
};

export default function SwapLimitInput(props: PropsWithChildren<SwapLimitInputProps>) {
  const {
    children,
    formattedTokenBalance,
    id,
    inputValue,
    label,
    onInputChange,
  } = props;

  const { prices } = usePrices();
  const ethData = prices["ETH/USD"];
  const ethPrice = parseFloat(ethData.currentPrice.toPrecision(4));

  const handleMarkClick = () => {
    onInputChange(ethPrice.toString());
  };

  return (
    <div className="rounded-md border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs" htmlFor={id}>
          {label}
        </label>
        {formattedTokenBalance !== undefined && (
          <span className="text-xs text-muted-foreground" onClick={handleMarkClick}>
            Mark : {ethPrice}
          </span>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between bg-transparent">
        <Input
          className="w-full bg-transparent text-lg"
          id={id}
          onChange={onInputChange}
          placeholder="0.00"
          value={inputValue}
          disabled={false}
        />
        {children}
        USDC per ETH
      </div>
    </div>
  );
}
