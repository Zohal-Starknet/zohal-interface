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
import IncreasePositionDialog from "./increase-position-dialog";
import DecreaseCollateralDialog from "./decrease-collateral-dialog";
import EditIcon from "./edit-collateral-icon";

interface EditPositionProps {
  position: Position;
}
export default function EditPosition({ position }: EditPositionProps) {
  const [openedModal, setOpenedModal] = useState<
    "decreaseCollateral" | "increaseCollateral" | undefined
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
          <button>
            <EditIcon />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="space-y-1">
          <DropdownMenuItem
            onClick={() => setOpenedModal("increaseCollateral")}
          >
            Increase collateral
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenedModal("decreaseCollateral")}
          >
            Decrease collateral
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DecreaseCollateralDialog
        position={position}
        collateral_amount={position.collateral_amount}
        open={openedModal === "decreaseCollateral"}
        onOpenChange={handleOpenChange}
      />
      <IncreaseCollateralDialog
        position={position}
        collateral_amount={position.collateral_amount}
        open={openedModal === "increaseCollateral"}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}
