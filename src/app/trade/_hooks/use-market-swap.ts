import { useContractWrite, useWaitForTransaction } from "@starknet-react/core";
import { TOKENS, type TokenSymbol } from "@zohal/app/_helpers/tokens";
import { useState } from "react";
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
  const selectedToken = TOKENS[payTokenSymbol];
  // TODO @YohanTz: Export this transaction logic to its own hook
  const [status, setStatus] = useState<TransactionStatus>("idle");

  const calls = [
    {
      calldata: [
        // spender
        addAddressPadding(
          "0x058B15b574e1bc3c423d300Fb120483CD238Dd523eF04cc115665FE88255F46E",
        ),
        // amount
        parseFloat(payTokenValue) * 10 ** selectedToken.decimals,
        0,
      ],
      contractAddress: selectedToken.address,
      entrypoint: "approve",
    },
  ];

  // TODO @YohanTz: Trigger toast here
  const { writeAsync } = useContractWrite({ calls });

  useWaitForTransaction({
    hash: lastTransactionHash,
    onAcceptedOnL2: () => {
      setStatus("idle");
      // Trigger success toast with link to the transaction on voyager
    },
    onNotReceived: () => {
      setStatus("loading");
    },
    onRejected: () => {
      setStatus("rejected");
      // Trigger error toast with link to the transaction on voyager
    },
    watch: true,
  });

  async function swap() {
    const transaction = await writeAsync();
    setLastTransactionHash(transaction.transaction_hash);
  }

  return { status, swap };
}
