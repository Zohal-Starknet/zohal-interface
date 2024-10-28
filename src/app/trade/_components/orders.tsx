"use client";

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { cn, type PropsWithClassName } from "@zohal/app/_lib/utils";
import { useAccount } from '@starknet-react/core'
import { Tokens } from '@zohal/app/_helpers/tokens';
import { ETH_CONTRACT_ADDRESS } from "@zohal/app/_lib/addresses";


type Order = {
  block_number: number;
  timestamp: string | null;
  transaction_hash: string;
  key: string | null;
  order_type: string | null;
  decrease_position_swap_type: string | null;
  account: string | null;
  receiver: string | null;
  callback_contract: string | null;
  ui_fee_receiver: string | null;
  market: string | null;
  initial_collateral_token: string | null;
  swap_path: string[] | null;
  size_delta_usd: string | null;
  initial_collateral_delta_amount: string | null;
  trigger_price: string | null;
  acceptable_price: string | null;
  execution_fee: string | null;
  callback_gas_limit: string | null;
  min_output_amount: string | null;
  updated_at_block: number | null;
  is_long: boolean | null;
  is_frozen: boolean | null;
  status_tx: string | null;
};

export default function Orders({ className }: PropsWithClassName) {
  const { address } = useAccount()
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/fetch-orders?address=${address}`);
      if (response.ok) {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        setOrders(responseData);
        setLoading(false);
      }
    } catch (error:any) {
      console.error('Error fetching orders:', error);
      setError(error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();

  }, [address]);

  if (loading) {
    return (
      <div className="mt-4 flex justify-center text-neutral-400">
        Loading Orders...
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="mt-4 flex justify-center text-neutral-400">
        No Orders
      </div>
    );
  }

  //@ts-ignore
  const formatSizeDeltaUSD = (sizeDeltaUSD) => {
    if (sizeDeltaUSD) {
      const sizeInUsd = (Number(sizeDeltaUSD)/10**16) / Number(10**18);
      const formattedSizeInUsd = sizeInUsd.toFixed(2).toString();
      return formattedSizeInUsd;
    }
    return sizeDeltaUSD;
  };


  return (
    <div className={clsx("w-full", className)}>
      <table className="w-full">
        <thead className="border-b border-border text-left">
          <tr className="text-muted-foreground">
            <th className={tableHeaderCommonStyles}>Market</th>
            <th className={tableHeaderCommonStyles}>Entry Price (USD)</th>
            <th className={tableHeaderCommonStyles}>Size in USD</th>
            <th className={tableHeaderCommonStyles}>Collateral</th>
            <th className={tableHeaderCommonStyles}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => {

            const positionLeverageETH = (Number(order.size_delta_usd) / 10**16) / (Number(order.initial_collateral_delta_amount) * Number(order.acceptable_price));
            const entry_price = (Number((BigInt(order.size_delta_usd!) / BigInt(order.initial_collateral_delta_amount!)) / BigInt(10**16))) / positionLeverageETH;

            return (
            <tr className="border-b border-border text-sm" key={order.transaction_hash || index}>
              <td className="flex gap-4 py-4">                  
                <div className="flex-shrink-0 rounded-full border border-border p-1">
                  <img
                    alt={`Ethereum icon`}
                    className="w-8 rounded-full"
                    src={Tokens.ETH.icon}
                  />
                </div>
                <div>
                    ETH-USD
                    <span
                      className={clsx(
                        "ml-4 rounded-sm px-1 py-0.5 text-xs font-semibold text-background",
                        order.is_long ? "bg-[#40B68B]" : "bg-[#FF5354]",
                      )}
                    >
                      {order.is_long ? "LONG" : "SHORT"}
                    </span>
                    <br />
                  </div>
              </td>
              <td>{(entry_price / 10**16).toFixed(2).toString() }</td>
              <td>{formatSizeDeltaUSD(order.size_delta_usd)}</td>
              <td>{order.initial_collateral_token == ETH_CONTRACT_ADDRESS ? "ETH" : "USDC"}</td>
              <td>{order.status_tx}</td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
}

const tableHeaderCommonStyles = "pb-4 font-normal";
