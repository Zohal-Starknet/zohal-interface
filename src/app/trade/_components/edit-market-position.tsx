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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
  };

  const openDecreaseCollateral = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-lg border border-border bg-secondary px-3 py-2">
            Market
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="space-y-1">
          <DropdownMenuItem onClick={() => openDecreaseCollateral}/* Change after*/>
            Increase collateral
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openDecreaseCollateral}>
            Decrease collateral
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openDecreaseCollateral}/* Change after*/>
            Increase position
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openDecreaseCollateral}/* Change after*/>
            Decrease position
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isModalOpen && (
        <ClosePositionDialog
          collateral_amount={collateral_amount}
          collateral_token={collateral_token}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
