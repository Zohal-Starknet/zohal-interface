import { useAccount, useStarkName } from "@starknet-react/core";

export function useDisplayName() {
  const { address } = useAccount();

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : undefined;

  // TODO @YohanTz: fix useStarkName hook
  const { data: starkName } = useStarkName({
    address: address ?? "",
  });

  return { starkName, truncatedAddress };
}
