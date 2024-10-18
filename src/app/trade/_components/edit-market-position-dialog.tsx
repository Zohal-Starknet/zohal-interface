"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@zohal/app/_ui/dropdown-menu";
import ClosePositionDialog from "./decrease-position-dialog";
import { useState } from "react";
import { Position } from "../_hooks/use-user-position";
import { Dialog } from "@zohal/app/_ui/Modal";
import DecreasePositionDialog from "./decrease-position-dialog";
import IncreaseCollateralDialog from "./increase-collateral-dialog";
import DecreaseCollateralDialog from "./decrease-collateral-dialog";
interface EditPositionProps {
  position: Position;
}
export default function EditPosition({ position }: EditPositionProps) {
  const [openedModal, setOpenedModal] = useState<
    | "decreaseCollateral"
    | "decreasePosition"
    | "increaseCollateral"
    | undefined
  >(undefined);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setOpenedModal("decreaseCollateral");
    } else {
      setOpenedModal(undefined);
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="rounded-lg border border-border bg-secondary px-3 py-2">
            Market
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="space-y-1">
          <DropdownMenuItem onClick={() => setOpenedModal("decreasePosition")}>
            Close position
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DecreasePositionDialog
        position={position}
        collateral_amount={position.collateral_amount}
        collateral_token={position.collateral_token}
        open={openedModal === "decreasePosition"}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}
