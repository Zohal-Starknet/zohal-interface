"use client";
import { useState } from "react";
import { BTC_MARKET_TOKEN_CONTRACT_ADDRESS, ETH_MARKET_TOKEN_CONTRACT_ADDRESS, STRK_MARKET_TOKEN_CONTRACT_ADDRESS } from "@zohal/app/_lib/addresses";
import { Order } from "../_hooks/use-user-order";
import EditOrderDialog from "./edit-order-dialog";

interface EditPositionProps {
  order: Order;
}

export default function EditOrder({ order }: EditPositionProps) {
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
        className="rounded-lg border border-border bg-secondary px-3 py-2 mr-2 hover:bg-gray-800"
        onClick={() => setOpenedModal("editOrder")}
      >
        Edit Order
      </button>

      <EditOrderDialog
        order={order}
        open={openedModal === "editOrder"}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}