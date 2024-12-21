"use client";
import { useState } from "react";
import { Order } from "../_hooks/use-user-order";
import CancelOrderDialog from "./cancel-order-dialog";

interface EditPositionProps {
  order: Order;
}

export default function CancelOrder({ order }: EditPositionProps) {
  const [openedModal, setOpenedModal] = useState<
    | "cancelOrder"
    | undefined
  >(undefined);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setOpenedModal("cancelOrder");
    } else {
      setOpenedModal(undefined);
    }
  };

  return (
    <>
      <button
        className="rounded-lg border border-border bg-secondary px-3 py-2 mr-2 hover:bg-blue-950"
        onClick={() => setOpenedModal("cancelOrder")}
      >
        Cancel Order
      </button>

      <CancelOrderDialog
        order={order}
        open={openedModal === "cancelOrder"}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}