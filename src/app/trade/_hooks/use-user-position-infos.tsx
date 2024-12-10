import {
  BTC_MARKET_TOKEN_CONTRACT_ADDRESS,
  STRK_MARKET_TOKEN_CONTRACT_ADDRESS,
  ETH_MARKET_TOKEN_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import useEthPrice, { PriceData, usePriceDataSubscription } from "./use-market-data";
import useBtcPrice from "./use-market-data-btc";
import useStrkPrice from "./use-market-data-strk";
import { Position } from "./use-user-position";
import { Tokens } from "@zohal/app/_helpers/tokens";
import useFormatNumber from "./use-format-number";

export type PositionInfos = {
  account: bigint;
  collateral_amount: string;
  collateral_token: string;
  collateral_symbol: string;
  is_long: boolean;
  market: string;
  size_in_tokens: bigint;
  size_in_usd: string;
  pnl: number;
  entry_price: string;
  leverage: string;
  liq_price: string;
};

export type NewPositionInfos = {
    new_size_in_tokens: bigint;
    new_size_in_usd: string;
    new_collateral_amount: string;
    new_pnl: number;
    new_entry_price: string;
    new_leverage: string;
    new_liq_price: string;
  };

export default function useUserPositionInfos() {
  const { tokenData: ethData } = usePriceDataSubscription({ pairSymbol: "ETH/USD" });
  const { tokenData: btcData } = usePriceDataSubscription({ pairSymbol: "BTC/USD" });
  const { tokenData: strkData } = usePriceDataSubscription({ pairSymbol: "STRK/USD" });

  function getPositionInfos(position: Position) {
    let collateral_symbol = "ETH";
    let multiplicator = 10**12;
    let divisor = 10**16;
    let tradedPriceData = ethData;
    const pragma_decimals = 8 ;
    if (position.market == ETH_MARKET_TOKEN_CONTRACT_ADDRESS) {
        collateral_symbol = "ETH";
    } if (position.market == BTC_MARKET_TOKEN_CONTRACT_ADDRESS) {
        collateral_symbol = "BTC";
        divisor = 10**26;
        multiplicator = 10**2;
        tradedPriceData = btcData;
    } if (position.market == STRK_MARKET_TOKEN_CONTRACT_ADDRESS) {
        collateral_symbol = "STRK";
        tradedPriceData = strkData;
    }

    const decimals = BigInt(10 ** 6);
    const collateralAmountBigInt = BigInt(position.collateral_amount);
    const usdAmount = Number(collateralAmountBigInt) / Number(decimals);
    const formattedUsdAmount = usdAmount.toFixed(2).toString();

    const sizeInUsd = (Number(position.size_in_usd)/10**16) / Number(10**18);
    const formattedSizeInUsd = sizeInUsd.toFixed(2).toString();

    const positionLeverage = (Number(position.size_in_usd) / 10**16) / (Number(position.collateral_amount) * 10**12);
    const entryPrice = (Number((BigInt(position.size_in_usd) / BigInt(position.size_in_tokens))) / divisor);

    const priceTrade = BigInt(tradedPriceData.pragmaPrice.toFixed(0)) * BigInt(10**(30)) / BigInt(10**(pragma_decimals - 4)) / BigInt(10**(Tokens[collateral_symbol].decimals));
    const pnl = position.is_long ? 
    (Number((BigInt(position.size_in_tokens) * BigInt(priceTrade)) - BigInt(position.size_in_usd)) / divisor) / Number(10**18)
    : ((Number((BigInt(position.size_in_tokens) * BigInt(priceTrade)) - BigInt(position.size_in_usd)) / divisor) / Number(10**18)) * -1;

    const liq_price = position.is_long ? (entryPrice - Number((BigInt(position.collateral_amount) * BigInt(multiplicator)) / BigInt(position.size_in_tokens))).toFixed(2).toString()
        : (entryPrice + Number((BigInt(position.collateral_amount) * BigInt(multiplicator)) / BigInt(position.size_in_tokens))).toFixed(2).toString()

    const positionInfos: PositionInfos = {
        account: position.account,
        collateral_amount: formattedUsdAmount,
        collateral_token: position.collateral_token,
        collateral_symbol: collateral_symbol,
        is_long: position.is_long,
        market: position.market,
        size_in_tokens: position.size_in_tokens,
        size_in_usd: formattedSizeInUsd,
        pnl: pnl,
        entry_price: entryPrice.toFixed(2),
        leverage: positionLeverage.toFixed(2).toString(),
        liq_price: liq_price
      };

      return positionInfos;
  }

  function getNewPositionInfos(position: Position, collateral_delta: bigint, size_delta_usd: bigint, order_increase: boolean) {
    const positionInfos = getPositionInfos(position);

    const decimals = BigInt(10 ** 6);
    let multiplicator = 10**12;
    let divisor = 10**16;
    let priceData = btcData;
    if (position.market === ETH_MARKET_TOKEN_CONTRACT_ADDRESS) {
      priceData = ethData;
    } else if (position.market === BTC_MARKET_TOKEN_CONTRACT_ADDRESS) {
      priceData = btcData;
      divisor = 10**26;
      multiplicator = 10**2;
    } else if (position.market === STRK_MARKET_TOKEN_CONTRACT_ADDRESS) {
      priceData = strkData;
    }

    const old_size_in_usd = position.size_in_usd;
    const old_size_in_tokens = position.size_in_tokens;
    const old_collateral_amount = position.collateral_amount;
    const old_entry_price = position.size_in_usd / position.size_in_tokens;

    const pragma_decimals = 8;
    let price =
        (BigInt(priceData.pragmaPrice.toFixed(0)) * BigInt(10 ** 30)) /
        BigInt(10 ** (pragma_decimals - 4)) /
        BigInt(10 ** 18);

    const new_size_in_usd = 
        order_increase ? old_size_in_usd + collateral_delta :
        old_size_in_usd - collateral_delta;
      
    const formatted_new_size_in_usd = (Number(new_size_in_usd)/10**16) / Number(10**18);

    const new_collateral_amount = 
        order_increase ? old_collateral_amount + collateral_delta :
        old_collateral_amount + collateral_delta;

    const formatted_new_collateral_amount = Number(new_collateral_amount) / Number(decimals);

    const new_leverage = formatted_new_collateral_amount > 0 ? formatted_new_size_in_usd / formatted_new_collateral_amount : 0;


    let new_size_in_tokens = BigInt(1);
    if (price !== BigInt(0)){
      new_size_in_tokens = (new_collateral_amount * BigInt(Math.round(new_leverage)) * decimals) / price;
    }

    let new_entry_price = ((old_size_in_tokens * old_entry_price + new_size_in_tokens * price) / (old_size_in_tokens + new_size_in_tokens)) / BigInt(10**16);

    const new_pnl = position.is_long
      ? Number((price - new_entry_price) * (new_size_in_tokens) / BigInt(10**18))
      : Number((new_entry_price - price) * (new_size_in_tokens) / BigInt(10**18))


    const new_liq_price = new_size_in_tokens > BigInt(0) 
      ? (position.is_long
      ? ((new_entry_price) - ((new_collateral_amount) * BigInt(10**6))) / new_size_in_tokens
      : ((new_entry_price) + ((new_collateral_amount) * BigInt(10**6))) / new_size_in_tokens)
      : BigInt(0)


    // const new_size_in_tokens = positionInfos
    const newPositionInfos: NewPositionInfos = {
        new_size_in_tokens: new_size_in_tokens,
        new_size_in_usd: formatted_new_size_in_usd.toString(),
        new_collateral_amount: formatted_new_collateral_amount.toString(),
        new_pnl: new_pnl,
        new_entry_price: new_entry_price.toString(),
        new_leverage: new_leverage.toFixed(2),
        new_liq_price: new_liq_price.toString()
      };

      return newPositionInfos;
  }


  return { getPositionInfos, getNewPositionInfos };
}
