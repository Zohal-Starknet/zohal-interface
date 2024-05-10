import { LoadIcon } from "@zohal/app/_ui/icons";

import Button from "../../_ui/button";
import { useConnectModal } from "../../zohal-modal";
import useMarketSwap from "../_hooks/use-market-swap";
import useMarketSwapp from "../_hooks/use-market-swapp";
import { Tokens } from "@zohal/app/_helpers/tokens";

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

  const { status, swap } = useMarketSwap({ payTokenSymbol, payTokenValue });
  const { swap: swapp } = useMarketSwapp();

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

  // TODO @YohanTz: loading directly in the Button component as a prop
  if (status === "loading") {
    return (
      <Button className={commonSwapActionButtonClassName}>
        <LoadIcon className="animate-spin" label="Loading..." />
      </Button>
    );
  }

  return (
    <Button className={commonSwapActionButtonClassName} onClick={() => swapp(payTokenSymbol, payTokenValue)}>
      Swap
    </Button>
  );
}

const commonSwapActionButtonClassName = "mt-8";
