import Button from "../../_ui/button";
import { useConnectModal } from "../../zohal-modal";

type SwapActionButtonProps = {
  /** Whether the user balance is sufficient or not */
  insufficientBalance: boolean;
  /** Whether an amount has been entered in the swap input or not */
  noEnteredAmount: boolean;
  /** Symbol of the token the user is going to pay with */
  payTokenSymbol: string;
};

export default function SwapActionButton(props: SwapActionButtonProps) {
  const { insufficientBalance, noEnteredAmount, payTokenSymbol } = props;

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

  return <Button className={commonSwapActionButtonClassName}>Swap</Button>;
}

const commonSwapActionButtonClassName = "mt-8";
