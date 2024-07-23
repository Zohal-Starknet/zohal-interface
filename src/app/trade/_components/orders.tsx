"use client";

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { cn, type PropsWithClassName } from "@zohal/app/_lib/utils";
import { useAccount } from '@starknet-react/core'

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
};

export default function Orders({ className }: PropsWithClassName) {
  const { address } = useAccount()
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/fetch-orders?address=${address}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        setError(error);
        setLoading(false);
      });
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
  const formatOrderType = (orderType) => {
    switch (orderType) {
      case 'MarketSwap':
        return 'Swap';
      case 'MarketIncrease':
        return 'Long';
      case 'MarketDecrease':
        return 'Short';
      default:
        return orderType;
    }
  };

    //@ts-ignore
  const formatMarket = (market) => {
    if (market === '0000000000000000000000000000000000000000000000000000000000000000' ||
        market === '0122cd6989d2429f580a0bff5e70cdb84b2bff4f8d19cee6b30a15d08c447e85') {
      return 'ETH/USD';
    }
    return market;
  };

    //@ts-ignore
  const formatSizeDeltaUSD = (sizeDeltaUSD) => {
    if (sizeDeltaUSD) {
      return (parseFloat(sizeDeltaUSD) / 10**18).toFixed(2);
    }
    return sizeDeltaUSD;
  };

  return (
    <div className={clsx("w-full", className)}>
      <table className="w-full">
        <thead className="border-b border-border text-left">
          <tr className="text-muted-foreground">
            <th className={tableHeaderCommonStyles}>Market</th>
            <th className={tableHeaderCommonStyles}>Type</th>
            <th className={tableHeaderCommonStyles}>Size (USD)</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr className="border-b border-border text-sm" key={order.transaction_hash || index}>
              <td>{formatMarket(order.market)}</td>
              <td>{formatOrderType(order.order_type)}</td>
              <td>{formatSizeDeltaUSD(order.size_delta_usd)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableHeaderCommonStyles = "pb-4 font-normal";
