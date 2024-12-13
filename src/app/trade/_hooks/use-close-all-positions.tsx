import { useAccount, useProvider } from "@starknet-react/core";
import {
  EXCHANGE_ROUTER_CONTRACT_ADDRESS,
  ORDER_VAULT_CONTRACT_ADDRESS,
  BTC_MARKET_TOKEN_CONTRACT_ADDRESS,
  STRK_MARKET_TOKEN_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import { CairoCustomEnum, Call, Contract, uint256 } from "starknet";

import exchange_router_abi from "../abi/exchange_router.json";
import useEthPrice, { usePythPriceSubscription } from "./use-market-data";
import useBtcPrice from "./use-market-data-btc";
import useStrkPrice from "./use-market-data-strk";

export type Position = {
  account: bigint;
  borrowing_factor: bigint;
  collateral_amount: bigint;
  collateral_token: string;
  decreased_at_block: bigint;
  funding_fee_amount_per_size: bigint;
  increased_at_block: bigint;
  is_long: boolean;
  key: bigint;
  long_token_claimable_funding_amount_per_size: bigint;
  market: string;
  short_token_claimable_funding_amount_per_size: bigint;
  size_in_tokens: bigint;
  size_in_usd: bigint;
};

export default function useCloseAllPositions() {
  const { priceData: ethData } = usePythPriceSubscription("ETH/USD");
  const { priceData: btcData } = usePythPriceSubscription("BTC/USD" );
  const { priceData: strkData } = usePythPriceSubscription("STRK/USD");
  const { account, address } = useAccount();
  const { provider } = useProvider();

  async function closeAllPositions(
    positions: Array<Position>,
  ) {
    if (account === undefined || address === undefined) {
      return;
    }

    const exchangeRouterContract = new Contract(
      exchange_router_abi.abi,
      EXCHANGE_ROUTER_CONTRACT_ADDRESS,
      provider,
    );
    
    const pragma_decimals = 8;
    const priceETH =
        (BigInt(ethData.pragmaPrice.toFixed(0)) * BigInt(10 ** 30)) /
        BigInt(10 ** (pragma_decimals - 4)) /
        BigInt(10 ** 18);
    const priceBTC =
        (BigInt(btcData.pragmaPrice.toFixed(0)) * BigInt(10 ** 30)) /
        BigInt(10 ** (pragma_decimals - 4)) /
        BigInt(10 ** 8);
    const priceSTRK =
        (BigInt(strkData.pragmaPrice.toFixed(0)) * BigInt(10 ** 30)) /
        BigInt(10 ** (pragma_decimals - 4)) /
        BigInt(10 ** 18);

    const calls: Array<Call> = [];

    positions.map((position, index) => {

        let price = priceETH;
        if (position.market == BTC_MARKET_TOKEN_CONTRACT_ADDRESS) {
            price = priceBTC
        }
        if (position.market == STRK_MARKET_TOKEN_CONTRACT_ADDRESS) {
            price = priceSTRK
        }

        const createOrderParams = {
        receiver: address,
        callback_contract: 0,
        ui_fee_receiver: 0,
        market: position.market,
        initial_collateral_token: USDC_CONTRACT_ADDRESS,
        swap_path: [],
        size_delta_usd: uint256.bnToUint256(position.size_in_usd),
        initial_collateral_delta_amount: uint256.bnToUint256(position.collateral_amount),
        trigger_price: uint256.bnToUint256(0),
        acceptable_price: position.is_long
            ? uint256.bnToUint256(
                BigInt((price * BigInt(105)) / BigInt(100)),
            )
            : uint256.bnToUint256(
                BigInt((price * BigInt(105)) / BigInt(100)),
            ),
        execution_fee: uint256.bnToUint256("0"),
        callback_gas_limit: uint256.bnToUint256(0),
        min_output_amount: uint256.bnToUint256(BigInt(0)),
        order_type: new CairoCustomEnum({ MarketDecrease: {} }),
        decrease_position_swap_type: new CairoCustomEnum({ NoSwap: {} }),
        is_long: position.is_long ? true : false,
        referral_code: "0x0",
        };

        const createOrderCall = exchangeRouterContract.populate("create_order", [
        createOrderParams,
        ]);

        calls.push(createOrderCall);
    
    })

    await account.execute(calls);
  }

  return { closeAllPositions };
}
