import { type TokenSymbol } from "@zohal/app/_helpers/tokens";
import Input from "@zohal/app/_ui/input";

import ChooseTokenButton from "./choose-token-button";

type LimitPriceInputProps = {
  /** Formatted balance of the current token */
  formattedTokenBalance?: string;
  /** Id used in htmlFor label and input id */
  id: string;
  /** Current value of the input */
  inputValue: string;
  /** Label used in the swap input */
  label: string;
  /** Function called on input change */
  onInputChange: (newInputValue: string) => void;
  /** Function called on token change */
  onTokenSymbolChange: (newTokenSymbol: TokenSymbol) => void;
  /** Symbol of the selected token */
  tokenLeftSymbol: TokenSymbol;
  tokenRightSymbol: TokenSymbol;
};

export default function LimitPriceInput(props: LimitPriceInputProps) {
  const {
    formattedTokenBalance,
    id,
    inputValue,
    label,
    onInputChange,
    onTokenSymbolChange,
    tokenLeftSymbol,
    tokenRightSymbol,
  } = props;
  return (
    <div className="rounded-md border border-[#363636] bg-[#25272E] p-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs" htmlFor={id}>
          {label}
        </label>
        {formattedTokenBalance !== undefined && (
          <span className="text-xs text-[#BCBCBD]">
            Mark: {formattedTokenBalance}
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
        />
        <span>{tokenLeftSymbol} per {tokenRightSymbol} </span>
        {/* <ChooseTokenButton
          onTokenSymbolChange={onTokenSymbolChange}
          tokenSymbol={tokenSymbol}
        /> */}
      </div>
    </div>
  );
}
