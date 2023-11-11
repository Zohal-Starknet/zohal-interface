import { useTransaction } from "@starknet-react/core";
import { LoadIcon } from "@zohal/app/_ui/icons";

import Button from "../../_ui/button";
import { useConnectModal } from "../../zohal-modal";
import useMarketSwap from "../_hooks/use-market-swap";

type SwapActionButtonProps = {
  /** Whether the user balance is sufficient or not */
  insufficientBalance: boolean;
  /** Whether an amount has been entered in the swap input or not */
  noEnteredAmount: boolean;
  /** Symbol of the token the user is going to pay with */
  payTokenSymbol: string;
  /** The value of the token that will be swapped */
  payTokenValue: string;
};

export default function SwapActionButton(props: SwapActionButtonProps) {
  const {
    insufficientBalance,
    noEnteredAmount,
    payTokenSymbol,
    payTokenValue,
  } = props;

  const { isLoading, swap } = useMarketSwap({ payTokenSymbol, payTokenValue });
  console.log("COMPO", isLoading);

  const { openConnectModal } = useConnectModal();

  if (openConnectModal) {
    return (
      <Button
        className={commonSwapActionButtonClassName}
        onClick={openConnectModal}
        variant="default"
      >
        Connect Wallet
      </Button>
    );
  }

  if (noEnteredAmount) {
    return (
      <Button className={commonSwapActionButtonClassName} disabled>
        Enter an amount
      </Button>
    );
  }

  if (insufficientBalance) {
    return (
      <Button className={commonSwapActionButtonClassName} disabled>
        Insufficient {payTokenSymbol} balance
      </Button>
    );
  }

  if (isLoading) {
    return (
      <Button className={commonSwapActionButtonClassName}>
        <LoadIcon className="animate-spin" label="Loading..." />
      </Button>
    );
  }

  return (
    <Button className={commonSwapActionButtonClassName} onClick={() => swap()}>
      Swap
    </Button>
  );
}

const commonSwapActionButtonClassName = "mt-8";
