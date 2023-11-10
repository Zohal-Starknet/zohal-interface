import { useContractWrite } from "@starknet-react/core";
import { TOKENS, type TokenSymbol } from "@zohal/app/_helpers/tokens";
import { addAddressPadding } from "starknet";

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
  const selectedToken = TOKENS[payTokenSymbol];

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
  const { write: swap } = useContractWrite({ calls });

  return { swap };
}
