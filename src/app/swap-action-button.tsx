import Button from "./ui/button";
import { useConnectModal } from "./zohal-modal";

type SwapActionButtonProps = {
  /** */
  insufficientBalance: boolean;
  /** */
  noEnteredAmount: boolean;
  /** Symbol of the token the user is going to pay with */
  payTokenSymbol: string;
};

export default function SwapActionButton(props: SwapActionButtonProps) {
  const { insufficientBalance, noEnteredAmount, payTokenSymbol } = props;

  const { openConnectModal } = useConnectModal();

  if (openConnectModal) {
    return (
      <Button className="mt-8" onClick={openConnectModal} variant="primary">
        Connect Wallet
      </Button>
    );
  }

  if (noEnteredAmount) {
    return (
      <Button className="mt-8" disabled>
        Enter an amount
      </Button>
    );
  }

  if (insufficientBalance) {
    return (
      <Button className="mt-8" disabled>
        Insufficient {payTokenSymbol} balance
      </Button>
    );
  }

  return <Button className="mt-8">Swap</Button>;
}
