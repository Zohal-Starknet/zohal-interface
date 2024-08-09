import { PropsWithClassName, cn } from "@zohal/app/_lib/utils";
import { Checkbox } from "@zohal/app/_ui/checkbox";
import { useState, useEffect } from "react";
import SlTpModal from  "./sl-tp-modal";
import { SlTpInfos } from "./sl-tp-modal";

type SlTpCheckboxProps = {
  slTpInfos: SlTpInfos;
  setSlTpInfos(arg0: SlTpInfos): void;
  orderPrice: number;
  qty: number;
};

export default function SlTpCheckbox({
  className,
  setSlTpInfos,
  slTpInfos,
  orderPrice,
  qty,
}: PropsWithClassName<SlTpCheckboxProps>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const hasTpOrSlInfo =
    slTpInfos.sl.length > 0 ||
    slTpInfos.slTriggerPrice.length > 0 ||
    slTpInfos.tp.length > 0 ||
    slTpInfos.tpTriggerPrice.length > 0;

  return (
    <div className={cn("", className)}>
      <SlTpModal
        setSlTpInfos={setSlTpInfos}
        slTpInfos={slTpInfos}
        orderPrice={orderPrice}
        qty={qty}
      >
        <div className="flex items-center gap-2">
          {isClient && <Checkbox checked={hasTpOrSlInfo} />}
          <p className="text-sm">TP / SL</p>
        </div>
      </SlTpModal>
    </div>
  );
}
