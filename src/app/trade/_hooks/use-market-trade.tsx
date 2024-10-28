import { useState } from "react";
import { useAccount, useProvider } from "@starknet-react/core";
import {
  MARKET_TOKEN_CONTRACT_ADDRESS,
  EXCHANGE_ROUTER_CONTRACT_ADDRESS,
  ORDER_VAULT_CONTRACT_ADDRESS,
  ETH_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import { CairoCustomEnum, Contract, uint256 } from "starknet";

import erc_20_abi from "../abi/erc_20.json";
import exchange_router_abi from "../abi/exchange_router.json";
import useEthPrice from "./use-market-data";

type TransactionStatus = "idle" | "loading" | "rejected";

//@ts-ignore
export default function useMarketTrade() {
  const { account, address } = useAccount();
  const { provider } = useProvider();
  const [status, setStatus] = useState<TransactionStatus>("idle");

  const {ethData} = useEthPrice();

  //@ts-ignore
  async function trade(tokenSymbol, tokenAmount, isLong, leverage, tpPrice, slPrice) {
    if (account === undefined || address === undefined) {
      return;
    }

    setStatus("loading");
    try {
      const tokenContract = new Contract(
        erc_20_abi.abi,
        tokenSymbol.address,
        provider,
      );

      const ethContract = new Contract(
        erc_20_abi.abi,
        ETH_CONTRACT_ADDRESS,
        provider,
      );

      const pragma_decimals =  tokenSymbol.name  == "Ethereum" ?  8  : 6 ;
    
      let priceTrade = BigInt(ethData.pragmaPrice.toFixed(0)) * BigInt(10**(30)) / BigInt(10**(pragma_decimals - 4)) / BigInt(10**(tokenSymbol.decimals))
      let pricePay = tokenSymbol.name == "Ethereum" ?  priceTrade : BigInt("10000000000000000000000000000") ;
      let acceptable_price = isLong ? uint256.bnToUint256(BigInt((pricePay * (BigInt(105) / BigInt(100))))) : uint256.bnToUint256(BigInt((pricePay * (BigInt(95) / BigInt(100)))));
      let size_delta_usd = uint256.bnToUint256(BigInt(leverage) * pricePay * BigInt(tokenAmount * (10 ** tokenSymbol.decimals)));


      const createOrderParams = {
        receiver: address,
        callback_contract: 0,
        ui_fee_receiver: 0,
        market: MARKET_TOKEN_CONTRACT_ADDRESS,
        initial_collateral_token: tokenSymbol.address,
        swap_path: [], 
        size_delta_usd: size_delta_usd,
        initial_collateral_delta_amount: uint256.bnToUint256(BigInt(tokenAmount * (10 ** tokenSymbol.decimals))),
        trigger_price: uint256.bnToUint256(0),
        acceptable_price: acceptable_price,
        execution_fee: uint256.bnToUint256("80000000000000"),
        callback_gas_limit: uint256.bnToUint256(0),
        min_output_amount: uint256.bnToUint256(0),
        order_type: new CairoCustomEnum({ MarketIncrease: {} }),
        decrease_position_swap_type: new CairoCustomEnum({ NoSwap: {} }),
        is_long: isLong ? true : false,
        referral_code: "0x0",
      };

      const exchangeRouterContract = new Contract(
        exchange_router_abi.abi,
        EXCHANGE_ROUTER_CONTRACT_ADDRESS,
        provider,
      );

      const calls = [];
      if (tokenSymbol.name == "Ethereum"){
        const transferCall = tokenContract.populate("transfer", [
          ORDER_VAULT_CONTRACT_ADDRESS,
          uint256.bnToUint256((BigInt(tokenAmount * 10 ** tokenSymbol.decimals)) + BigInt("80000000000000")),
        ]);
        calls.push(transferCall);
        
      } else {

        const transferCall = tokenContract.populate("transfer", [
          ORDER_VAULT_CONTRACT_ADDRESS,
          uint256.bnToUint256(BigInt(tokenAmount * (10 ** tokenSymbol.decimals))),
        ]);

        calls.push(transferCall);
        const transferCall2 = ethContract.populate("transfer", [
            ORDER_VAULT_CONTRACT_ADDRESS,
            uint256.bnToUint256(BigInt("80000000000000")),
        ]);

        calls.push(transferCall2);
      }


      const createOrderCall = exchangeRouterContract.populate("create_order", [
        createOrderParams,
      ]);
      
    

      calls.push(createOrderCall);
      if (tpPrice) {
        const transferCall3 = ethContract.populate("transfer", [
          ORDER_VAULT_CONTRACT_ADDRESS,
          uint256.bnToUint256(BigInt("80000000000000")),
      ]);
      calls.push(transferCall3);
        tpPrice =  BigInt(tpPrice) * BigInt(10 ** pragma_decimals);
        const tpOrderParams = {
          ...createOrderParams,
          trigger_price: uint256.bnToUint256(BigInt(tpPrice)),
          acceptable_price : isLong ? uint256.bnToUint256(BigInt((tpPrice * BigInt(95) / BigInt(100)))) : uint256.bnToUint256(BigInt((tpPrice * BigInt(105) / BigInt(100)))),
          order_type: new CairoCustomEnum({ LimitDecrease: {} }),
        };
        const createTpOrderCall = exchangeRouterContract.populate("create_order", [
          tpOrderParams,
        ]);
        calls.push(createTpOrderCall);
      }

      if (slPrice) {
        const transferCall4 = ethContract.populate("transfer", [
          ORDER_VAULT_CONTRACT_ADDRESS,
          uint256.bnToUint256(BigInt("80000000000000")),
      ]);
      calls.push(transferCall4);
        slPrice =  BigInt(slPrice) * BigInt(10 ** pragma_decimals);
        const slOrderParams = {
          ...createOrderParams,
          trigger_price: uint256.bnToUint256(BigInt(slPrice)),
          acceptable_price : isLong ? uint256.bnToUint256(BigInt((slPrice * BigInt(95) / BigInt(100)))) : uint256.bnToUint256(BigInt((slPrice * BigInt(105) / BigInt(100)))),
          order_type: new CairoCustomEnum({ LimitDecrease: {} }),
        };
        const createSlOrderCall = exchangeRouterContract.populate("create_order", [
          slOrderParams,
        ]);
        calls.push(createSlOrderCall);
      }

      await account.execute(calls);
    
      setStatus("idle");
    } catch (error) {
      console.error(error);
      setStatus("rejected"); 
    }
  }

  return { trade };
}