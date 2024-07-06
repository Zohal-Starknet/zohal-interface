"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@zohal/app/_ui/dropdown-menu";
import ClosePositionDialog from "./close-position-dialog";
import { useState } from "react";

interface EditPositionProps {
  collateral_amount: bigint;
  collateral_token: bigint;
}

export default function EditPosition({
  collateral_amount,
  collateral_token,
}: EditPositionProps) {
  const [openedModal, setOpenedModal] = useState<
    "decreaseCollateral" | undefined
  >(undefined);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-lg border border-[#363636] bg-[#1b1d22] px-3 py-2">
            Edit
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setOpenedModal("decreaseCollateral")}
          >
            Decrease collateral
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* 
      <ClosePositionDialog
        collateral_amount={collateral_amount}
        collateral_token={collateral_token}
        open={openedModal === "decreaseCollateral"}
        onOpenChange={(open) =>
          open
            ? setOpenedModal("decreaseCollateral")
            : setOpenedModal(undefined)
        }
      /> */}
    </>
  );
}
