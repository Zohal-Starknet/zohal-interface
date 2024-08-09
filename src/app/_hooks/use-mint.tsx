import { useAccount, useProvider } from "@starknet-react/core";
import {
  ETH_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import { Contract, uint256 } from "starknet";

import erc_20_abi from "@zohal/app/trade/abi/erc_20.json";

export default function useMint() {
  const { account, address } = useAccount();
  const { provider } = useProvider();

  function mint() {
    if (account === undefined || address === undefined) {
      return;
    }

    const ethTokenContract = new Contract(
      erc_20_abi.abi,
      ETH_CONTRACT_ADDRESS,
      provider,
    );
    console.log("Address: " +address);


    const createMintCall = ethTokenContract.populate(
      "mint",
      [ address,
        uint256.bnToUint256(BigInt(3000000000000000000))],
    );

    void account.execute([
        createMintCall
    ]);
  }

  return { mint };
}
