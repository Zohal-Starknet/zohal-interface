"use client";
import { useAccount, useBalance } from "@starknet-react/core";
import { TOKENS } from "@zohal/app/_helpers/tokens";

import Fieldset from "../../_ui/fieldset";
import Form from "../../_ui/form";
import Input from "../../_ui/input";
import { useTokenInputs } from "../_hooks/use-token-input";
import SwapMoreInformations from "./more-informations";
import SwapActionButton from "./swap-action-button";
import TokenSwapButton from "./token-swap-button";

/**
 * TODO @YohanTz - Use big numbers for calculations
 */
export default function Swap() {
  const ethBtcRatio = 0.055;

  const { address } = useAccount();

  const {
    payTokenSymbol,
    payTokenValue,
    receiveTokenSymbol,
    receiveTokenValue,
    switchTokens,
    updatePayTokenValue,
    updateReceiveTokenValue,
  } = useTokenInputs({ ratio: ethBtcRatio });

  const { data: payTokenBalance } = useBalance({
    address,
    token: TOKENS[payTokenSymbol].address,
  });
  const { data: receiveTokenBalance } = useBalance({
    address,
    token: TOKENS[receiveTokenSymbol].address,
  });

  const noEnteredAmount =
    payTokenValue.length === 0 && receiveTokenValue.length === 0;

  const insufficientBalance = payTokenBalance
    ? parseFloat(payTokenBalance.formatted) < parseFloat(payTokenValue)
    : true;

  return (
    <Form>
      <Fieldset
        field={
          <Input
            onChange={updatePayTokenValue}
            placeholder="0.00"
            value={payTokenValue}
          />
        }
        label="Pay"
      />

      <TokenSwapButton onClick={switchTokens} />

      <Fieldset
        field={
          <div className="flex items-center justify-between">
            <Input
              className="w-full"
              onChange={updateReceiveTokenValue}
              placeholder="0.00"
              value={receiveTokenValue}
            />
            <div>
              <p>{receiveTokenSymbol}</p>

              {receiveTokenBalance !== undefined && (
                <span className="text-xs text-[#BCBCBD]">
                  Balance:{" "}
                  {parseFloat(receiveTokenBalance.formatted).toFixed(3)}
                </span>
              )}
            </div>
          </div>
        }
        label="Receive"
      />

      <SwapMoreInformations
        payTokenSymbol={payTokenSymbol}
        ratio={ethBtcRatio}
        receiveTokenSymbol={receiveTokenSymbol}
      />

      <SwapActionButton
        insufficientBalance={insufficientBalance}
        noEnteredAmount={noEnteredAmount}
        payTokenSymbol={payTokenSymbol}
      />
    </Form>
  );
}
