"use client";
import { useState } from "react";
import { BTC_MARKET_TOKEN_CONTRACT_ADDRESS, ETH_MARKET_TOKEN_CONTRACT_ADDRESS, STRK_MARKET_TOKEN_CONTRACT_ADDRESS } from "@zohal/app/_lib/addresses";
import { Order } from "../_hooks/use-user-order";
import EditOrderDialog from "./edit-order-dialog";

interface EditPositionProps {
  order: Order;
  old_size_delta: string;
  old_trigger_price: string;
}

export default function EditOrder({ order, old_size_delta, old_trigger_price }: EditPositionProps) {
  const [openedModal, setOpenedModal] = useState<
    | "editOrder"
    | undefined
  >(undefined);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setOpenedModal("editOrder");
    } else {
      setOpenedModal(undefined);
    }
  };

  return (
    <>
      <button
        className="rounded-lg border border-border bg-secondary px-3 py-2 mr-2 hover:bg-blue-950"
        onClick={() => setOpenedModal("editOrder")}
      >
        Edit Order
      </button>

      <EditOrderDialog
        order={order}
        old_size_delta={old_size_delta}
        old_trigger_price={old_trigger_price}
        open={openedModal === "editOrder"}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}