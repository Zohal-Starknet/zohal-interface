import { useAccount, useBalance } from "@starknet-react/core";

export function useDisplayBalance() {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });

  const displayBalance = balanceData
    ? `${parseFloat(balanceData.formatted).toFixed(4)} ${balanceData.symbol}`
    : undefined;

  return displayBalance;
}
