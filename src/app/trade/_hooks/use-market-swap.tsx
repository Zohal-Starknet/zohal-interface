import { useContractWrite, useWaitForTransaction } from "@starknet-react/core";
import { robotoMono } from "@zohal/app/_helpers/fonts";
import { Tokens, type TokenSymbol } from "@zohal/app/_helpers/tokens";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "sonner";
import { addAddressPadding } from "starknet";

type TransactionStatus = "idle" | "loading" | "rejected";

type UseMarketSwapProps = {
  /** Symbol of the token that will be swapped */
  payTokenSymbol: TokenSymbol;
  /** Value of the token that will be swapped */
  payTokenValue: string;
};

/**
 * Hook use to approve necessary tokens
 * TODO @YohanTz: Add swap to the multicall once contracts deployed
 */
export default function useMarketSwap(props: UseMarketSwapProps) {
  const { payTokenSymbol, payTokenValue } = props;
  const [lastTransactionHash, setLastTransactionHash] = useState<
    string | undefined
  >(undefined);
  const selectedToken = Tokens[payTokenSymbol];
  // TODO @YohanTz: Export this transaction logic to its own hook (status, toast etc)
  const [status, setStatus] = useState<TransactionStatus>("idle");

  const calls = [
    {
      calldata: [
        // spender
        addAddressPadding(
          "0x058B15b574e1bc3c423d300Fb120483CD238Dd523eF04cc115665FE88255F46E",
        ),
        // amount
        // TODO @YohanTz: Use BigNumber
        parseFloat(payTokenValue) * 10 ** selectedToken.decimals,
        0,
      ],
      contractAddress: selectedToken.address,
      entrypoint: "approve",
    },
  ];

  const { writeAsync } = useContractWrite({ calls });

  useWaitForTransaction({
    hash: lastTransactionHash,
    // onAcceptedOnL2: () => {
    //   if (status !== "idle") {
    //     setStatus("idle");
    //     toast.custom((t) => {
    //       function onClose() {
    //         toast.dismiss(t);
    //       }
    //       return (
    //         <TransactionToast
    //           lastTransactionHash={lastTransactionHash}
    //           onClose={onClose}
    //         />
    //       );
    //     });
    //   }
    // },
    // onNotReceived: () => {
    //   setStatus("loading");
    // },
    // onPending: () => {
    //   setStatus("loading");
    // },
    // onRejected: () => {
    //   setStatus("rejected");
    //   // TODO @YohanTz: Trigger error toast with link to the transaction on starkscan
    // },
    watch: true,
  });

  async function swap() {
    const transaction = await writeAsync();
    setLastTransactionHash(transaction.transaction_hash);
  }

  return { status, swap };
}

type TransactionToastProps = {
  /** Transaction hash of the last transaction executed */
  lastTransactionHash?: string;
  /** Function to be called when closing the Toast */
  onClose: () => void;
};

/**
 * TODO @YohanTz: Export to the design system
 * And should only be close with a cross appearing on hover of the toast
 */
function TransactionToast(props: TransactionToastProps) {
  const { lastTransactionHash, onClose } = props;

  return (
    <button
      className={clsx(
        "flex flex-col gap-0.5 rounded-md border border-[#363636] bg-[#25272e] p-4",
        robotoMono.className,
      )}
      onClick={onClose}
    >
      <span className="text-sm">Swap Transaction successful!</span>
      <span className="text-left text-xs text-[#BCBCBD]">
        Your transaction has been accepted on the L2
      </span>
      <a
        className="mt-3 text-sm hover:underline"
        href={`https://testnet.starkscan.co/tx/${lastTransactionHash}`}
        // We want to stop even propagation here, so the toast is not closed when we open the starkscan link
        onClick={(event) => event.stopPropagation()}
      >
        View on Starkscan
      </a>
    </button>
  );
}
