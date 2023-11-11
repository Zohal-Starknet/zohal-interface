import { useAccount, useBalance } from "@starknet-react/core";
import { useMemo } from "react";

export function useDisplayBalance() {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });

  const displayBalance = useMemo(() => {
      return balanceData
          ? `${parseFloat(balanceData.formatted).toFixed(4)} ${balanceData.symbol}`
          : undefined
  }, [balanceData]);

  return displayBalance;
}
