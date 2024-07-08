"use client";

import { PropsWithClassName, cn } from "@zohal/app/_lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@zohal/app/_ui/Modal";
import Button from "@zohal/app/_ui/button";
import { Checkbox } from "@zohal/app/_ui/checkbox";
import Divider from "@zohal/app/_ui/divider";
import Input from "@zohal/app/_ui/input";
import { PropsWithChildren, useState } from "react";

export type SlTpInfos = {
  tpTriggerPrice: string;
  tpRoi: string;
  slTriggerPrice: string;
  slRoi: string;
};

type SlTpCheckboxProps = {
  slTpInfos: SlTpInfos;
  setSlTpInfos(arg0: SlTpInfos): void;
};

function SlTpModal({
  children,
  slTpInfos,
  setSlTpInfos,
}: PropsWithChildren<SlTpCheckboxProps>) {
  const [isOpen, setIsOpen] = useState(false);

  const [temporarySlTpInfos, setTemporarySlTpInfos] =
    useState<SlTpInfos>(slTpInfos);

  function onUpdateTpTriggerPrice(newTpTriggerPrice: string) {
    // Update ROI here
    setTemporarySlTpInfos({
      ...temporarySlTpInfos,
      tpTriggerPrice: newTpTriggerPrice,
    });
  }

  function onUpdateSlTriggerPrice(newSlTriggerPrice: string) {
    // Update ROI here
    setTemporarySlTpInfos({
      ...temporarySlTpInfos,
      slTriggerPrice: newSlTriggerPrice,
    });
  }

  function onUpdateTpRoi(newTpRoi: string) {
    // Update Trigger price here
    setTemporarySlTpInfos({
      ...temporarySlTpInfos,
      tpRoi: newTpRoi,
    });
  }

  function onUpdateSlRoi(newSlRoi: string) {
    // Update Trigger price here
    setTemporarySlTpInfos({
      ...temporarySlTpInfos,
      slRoi: newSlRoi,
    });
  }

  function onConfirm() {
    setSlTpInfos(temporarySlTpInfos);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        {children}
      </DialogTrigger>
      <DialogContent className=" max-w-lg">
        <DialogHeader>Add TP/SL</DialogHeader>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Order Price</p>
            <p>2,993</p>
          </div>
          <div>
            <p className="text-muted-foreground">Qty</p>
            <p>0.33</p>
          </div>
          <div className="text-end">
            <p className="text-muted-foreground">Last traded price</p>
            <p>2,992</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-muted-foreground">Applicable to</p>
          <p>Entire position</p>
        </div>

        <div className="mt-4 text-sm">
          <p className="text-muted-foreground">
            Take Profit-Trigger by ROI (%)
          </p>
          <div className="mt-1.5">
            <div className="grid grid-cols-[2fr_1fr] gap-4">
              <Input
                className="h-12 w-full rounded-md bg-secondary px-2 text-xs"
                placeholder="Trigger price"
                value={temporarySlTpInfos.tpTriggerPrice}
                onChange={onUpdateTpTriggerPrice}
              />
              <div className="flex h-12 w-full items-center overflow-hidden rounded-md bg-secondary pr-2">
                <Input
                  className="h-full w-full bg-secondary px-2 text-xs"
                  placeholder="ROI"
                  value={temporarySlTpInfos.tpRoi}
                  onChange={onUpdateTpRoi}
                />
                <span>%</span>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <div className="mt-4 text-sm">
          <p className="text-muted-foreground">Stop Loss-Trigger by ROI (%)</p>
          <div className="mt-1.5">
            <div className="grid grid-cols-[2fr_1fr] gap-4">
              <Input
                className="h-12 w-full rounded-md bg-secondary px-2 text-xs"
                placeholder="Trigger price"
                value={temporarySlTpInfos.slTriggerPrice}
                onChange={onUpdateSlTriggerPrice}
              />
              <div className="flex h-12 w-full items-center overflow-hidden rounded-md bg-secondary pr-2">
                <Input
                  className="h-full w-full bg-secondary px-2 text-xs"
                  placeholder="ROI"
                  value={temporarySlTpInfos.slRoi}
                  onChange={onUpdateSlRoi}
                />
                <span>%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <Button variant="default" onClick={onConfirm}>
            Confirm
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              // TODO @YohanTz: Refacto
              setTemporarySlTpInfos({
                slRoi: "",
                slTriggerPrice: "",
                tpRoi: "",
                tpTriggerPrice: "",
              });
              setSlTpInfos({
                slRoi: "",
                slTriggerPrice: "",
                tpRoi: "",
                tpTriggerPrice: "",
              });
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function SlTpCheckbox({
  className,
  setSlTpInfos,
  slTpInfos,
}: PropsWithClassName<SlTpCheckboxProps>) {
  // TODO @YohanTz: Refacto
  const hasTpOrSlInfo =
    slTpInfos.slRoi.length > 0 ||
    slTpInfos.slTriggerPrice.length > 0 ||
    slTpInfos.tpRoi.length > 0 ||
    slTpInfos.tpTriggerPrice.length > 0;

  return (
    <div className={cn("", className)}>
      <SlTpModal setSlTpInfos={setSlTpInfos} slTpInfos={slTpInfos}>
        <button className="flex items-center gap-2">
          <Checkbox checked={hasTpOrSlInfo} />
          <p className="text-sm">TP / SL (Entire position)</p>
        </button>
      </SlTpModal>
    </div>
  );
}
