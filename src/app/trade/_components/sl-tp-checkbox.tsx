import { PropsWithClassName, cn } from "@zohal/app/_lib/utils";
import { Checkbox } from "@zohal/app/_ui/checkbox";
import { useState, useEffect } from "react";
import SlTpModal from "./sl-tp-modal";
import { SlTpInfos } from "./sl-tp-modal";
type SlTpCheckboxProps = {
  slTpInfos: SlTpInfos;
  setSlTpInfos(arg0: SlTpInfos): void;
  orderPrice: number;
  qty: number;
  isLong: boolean;
};

export default function SlTpCheckbox({
  className,
  setSlTpInfos,
  slTpInfos,
  orderPrice,
  qty,
  isLong,
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
        isLong={isLong}
      >
        <div className="flex items-center gap-2">
          {isClient && <Checkbox checked={hasTpOrSlInfo} />}
          {isLong ? (
            <p className="text-sm">Long TP / SL</p>
          ) : (
            <p className="text-sm">Short TP / SL</p>
          )}
        </div>
      </SlTpModal>
    </div>
  );
}
