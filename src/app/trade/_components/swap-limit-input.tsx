import Input from "@zohal/app/_ui/input";

import { PropsWithChildren } from "react";
import useEthPrice from "../_hooks/use-market-data";

type SwapInputProps = {
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

export default function SwapInput(props: PropsWithChildren<SwapInputProps>) {
    const {
        children,
        formattedTokenBalance,
        id,
        inputValue,
        payTokenSymbol,
        receiveTokenSymbol,
        label,
        onInputChange,
    } = props;

    const { ethData } = useEthPrice();
    const ethPrice = parseFloat(ethData.currentPrice.toPrecision(4));

    return (
        <div className="rounded-md border border-border bg-card p-3">
            <div className="flex items-center justify-between">
                <label className="block text-xs" htmlFor={id}>
                    {label}
                </label>
                {formattedTokenBalance !== undefined && (
                    <span className="text-xs text-muted-foreground">
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
                />
                {children}
                {payTokenSymbol} per {receiveTokenSymbol}
            </div>
        </div>
    );
}
