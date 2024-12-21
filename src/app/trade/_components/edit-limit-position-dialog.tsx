"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@zohal/app/_ui/dropdown-menu";
import { useState } from "react";
import { Position } from "../_hooks/use-user-position";
import DecreaseLimitPositionDialog from "./decrease-limit-position-dialog";
import IncreaseLimitPositionDialog from "./increase-limit-position-dialog";
import { BTC_MARKET_TOKEN_CONTRACT_ADDRESS, ETH_MARKET_TOKEN_CONTRACT_ADDRESS, STRK_MARKET_TOKEN_CONTRACT_ADDRESS } from "@zohal/app/_lib/addresses";
import  {  usePrices } from "../_hooks/use-market-data";
interface EditPositionProps {
  position: Position;
}
export default function EditPosition({ position }: EditPositionProps) {
  const [openedModal, setOpenedModal] = useState<
    | "decreasePosition"
    | "increasePosition"
    | undefined
  >(undefined);
  // const { tokenData: ethData } = usePriceDataSubscription({ pairSymbol: "ETH/USD" });
  // const { tokenData: btcData } = usePriceDataSubscription({ pairSymbol: "BTC/USD" });
  // const { tokenData: strkData } = usePriceDataSubscription({ pairSymbol: "STRK/USD" });
  const { prices } = usePrices();
  const ethData = prices["ETH/USD"];
  const btcData = prices["BTC/USD"];
  const strkData = prices["STRK/USD"];
  const [priceData, setPriceData] = useState(btcData);
  const [tokenSymbol, setTokenSymbol] = useState("BTC");

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setOpenedModal("decreasePosition");
      if (position.market === ETH_MARKET_TOKEN_CONTRACT_ADDRESS) {
        setPriceData(ethData);
        setTokenSymbol("ETH");
      } else if (position.market === BTC_MARKET_TOKEN_CONTRACT_ADDRESS) {
        setPriceData(btcData);
        setTokenSymbol("BTC");
      } else if (position.market === STRK_MARKET_TOKEN_CONTRACT_ADDRESS) {
        setPriceData(strkData);
        setTokenSymbol("STRK");
      }
    } else {
      setOpenedModal(undefined);
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="rounded-lg border border-border bg-secondary px-3 py-2 mr-2 hover:bg-blue-950">
            Limit
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="space-y-1">
          <DropdownMenuItem onClick={() => setOpenedModal("increasePosition")}>
            Increase position
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenedModal("decreasePosition")}>
            Decrease position
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DecreaseLimitPositionDialog
        position={position}
        collateral_amount={position.collateral_amount}
        open={openedModal === "decreasePosition"}
        onOpenChange={handleOpenChange}
        price={priceData}
      />
      <IncreaseLimitPositionDialog
        position={position}
        collateral_amount={position.collateral_amount}
        open={openedModal === "increasePosition"}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}