import { Tokens } from "@zohal/app/_helpers/tokens";
import useMarketTokenBalance from "@zohal/app/_hooks/use-market-token-balance";
import { useMemo } from "react";

export function useDisplayBalance() {
  const { marketTokenBalance: payTokenBalance } = useMarketTokenBalance({
    marketTokenAddress: Tokens["USDC"].address,
    decimal: Tokens["USDC"].decimals,
  });

  const displayBalance = useMemo(() => {
    return payTokenBalance
      ? `${Number(payTokenBalance).toFixed(2)} ${Tokens["USDC"].name}`
      : undefined;
  }, [payTokenBalance]);

  return displayBalance;
}
