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

//@ts-ignore
export default function useMarketTrade() {
  const { account, address } = useAccount();
  const { provider } = useProvider();
  const {ethData} = useEthPrice();

  //@ts-ignore
  async function trade(tokenSymbol, tokenAmount, isLong, leverage, tpPrice, slPrice) {
    if (account === undefined || address === undefined) {
      return;
    }

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


    // const approveCall = tokenContract.populate("approve", [
    //   ORDER_VAULT_CONTRACT_ADDRESS,
    //   uint256.bnToUint256(BigInt(tokenAmount * 10 ** tokenSymbol.decimals)),
    // ]);

    console.log("Token amount: ", tokenAmount);
    // const transferCall = tokenContract.populate("transfer", [
    //   ORDER_VAULT_CONTRACT_ADDRESS,
      // uint256.bnToUint256(BigInt(tokenAmount * 10 ** tokenSymbol.decimals)),
    // ]);

    console.log("Eth data: ", ethData.currentPrice.toPrecision(4));
    console.log("Lev: ", leverage);
    const pragma_decimals =  tokenSymbol.name  == "Ethereum" ?  8  : 6 ;
    console.log("Pragma Decimals: ", pragma_decimals);
    console.log("Pragma Price : ", ethData.pragmaPrice.toFixed(0));
    console.log("Token decimals: ", tokenSymbol.decimals);
    let price = BigInt(ethData.pragmaPrice.toFixed(0)) * BigInt(10**(30)) / BigInt(10**(pragma_decimals - 4)) / BigInt(10**(tokenSymbol.decimals));
   
    console.log("Price: ", price);
    let acceptable_price = isLong ? uint256.bnToUint256(BigInt((price * (BigInt(105) / BigInt(100))))) : uint256.bnToUint256(BigInt((price * (BigInt(95) / BigInt(100)))));

    
    console.log("Acceptable price : ", acceptable_price);

    const createOrderParams = {
      receiver: address,
      callback_contract: 0,
      ui_fee_receiver: 0,
      market: MARKET_TOKEN_CONTRACT_ADDRESS,
      initial_collateral_token: tokenSymbol.address,
      swap_path: [], 
      size_delta_usd: uint256.bnToUint256(BigInt(leverage) * price * BigInt(tokenAmount * (10 ** tokenSymbol.decimals))),
      initial_collateral_delta_amount: uint256.bnToUint256(BigInt(tokenAmount * (10 ** tokenSymbol.decimals))),
      trigger_price: uint256.bnToUint256(0),
      acceptable_price: isLong ? uint256.bnToUint256(BigInt((price * (BigInt(105) / BigInt(100))))) : uint256.bnToUint256(BigInt((price * (BigInt(95) / BigInt(100))))),
      execution_fee: uint256.bnToUint256("80000000000000"),
      callback_gas_limit: uint256.bnToUint256(0),
      min_output_amount: uint256.bnToUint256(0),
      order_type: new CairoCustomEnum({ MarketIncrease: {} }),
      decrease_position_swap_type: new CairoCustomEnum({ NoSwap: {} }),
      is_long: isLong ? true : false,
      referral_code: "0x0",
    };

    console.log("Create order params SIZE DELTA USD: ", createOrderParams.size_delta_usd);
    console.log("Create order params INITIAL COLLATERAL DELTA AMOUNT: ", createOrderParams.initial_collateral_delta_amount);
    console.log("Create order params ACCEPTABLE PRICE: ", createOrderParams.acceptable_price);
    const exchangeRouterContract = new Contract(
      exchange_router_abi.abi,
      EXCHANGE_ROUTER_CONTRACT_ADDRESS,
      provider,
    );

    const createOrderCall = exchangeRouterContract.populate("create_order", [
      createOrderParams,
    ]);
    

    // const calls = [approveCall, transferCall, createOrderCall];
    const calls = [createOrderCall];

    
    if (tpPrice) {
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
  

    if (tokenSymbol.name == "Ethereum"){

      const transferCall = tokenContract.populate("transfer", [
        ORDER_VAULT_CONTRACT_ADDRESS,
        uint256.bnToUint256((BigInt(tokenAmount * 10 ** tokenSymbol.decimals)) + BigInt("80000000000000")),
      ]);

      await account.execute([transferCall, createOrderCall]);

    } else {

      const transferCall = tokenContract.populate("transfer", [
        ORDER_VAULT_CONTRACT_ADDRESS,
        uint256.bnToUint256(BigInt(tokenAmount * (10 ** tokenSymbol.decimals))),
      ]);

      const transferCall2 = ethContract.populate("transfer", [
          ORDER_VAULT_CONTRACT_ADDRESS,
          uint256.bnToUint256(BigInt("80000000000000")),
      ]);

      await account.execute([transferCall, transferCall2, createOrderCall]);
    }
  }

  return { trade };
}