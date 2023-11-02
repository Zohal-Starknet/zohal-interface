import { useAccount, useStarkName } from "@starknet-react/core";
import { useMemo } from "react";

export function useDisplayName() {
  const { address } = useAccount();

  const truncatedAddress = useMemo(() => {
    return address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : undefined;
  }, [address]);

  // TODO @YohanTz: fix useStarkName hook
  const { data: starkName } = useStarkName({
    address: address ?? "",
  });

  return { starkName, truncatedAddress };
}
