import { PropsWithChildren, useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@zohal/app/_ui/Modal";
import Button from "@zohal/app/_ui/button";
import Divider from "@zohal/app/_ui/divider";
import Input from "@zohal/app/_ui/input";

export type SlTpInfos = {
  tpTriggerPrice: string;
  tp: string;
  slTriggerPrice: string;
  sl: string;
};

type SlTpCheckboxProps = {
  slTpInfos: SlTpInfos;
  setSlTpInfos(arg0: SlTpInfos): void;
  orderPrice: number;
  qty: number;
};

function SlTpModal({
  children,
  slTpInfos,
  setSlTpInfos,
  orderPrice,
  qty,
}: PropsWithChildren<SlTpCheckboxProps>) {
  const [isOpen, setIsOpen] = useState(false);

  const [temporarySlTpInfos, setTemporarySlTpInfos] =
    useState<SlTpInfos>(slTpInfos);



  const onUpdateTpTriggerPrice = useCallback(
    function onUpdateTpTriggerPrice(tpPrice: string) {
      const newTpTriggerPrice = tpPrice;
      setTemporarySlTpInfos((prevInfos) => {
        const newInfos = { ...prevInfos, tpTriggerPrice: newTpTriggerPrice };
        onUpdateTp(newInfos.tpTriggerPrice);
        return newInfos;
      });
    },
    [orderPrice, qty]
  );
  

  const onUpdateSlTriggerPrice = useCallback(
    function onUpdateSlTriggerPrice(slPrice: string) {
      const newSlTriggerPrice = slPrice;
      setTemporarySlTpInfos((prevInfos) => ({
        ...prevInfos,
        slTriggerPrice: newSlTriggerPrice,
      }));
    },
    [orderPrice, qty]
  );
  
  const onUpdateTp = useCallback(
    function onUpdateTp(tpPrice: string) {
      const newTp = (Number(tpPrice) - orderPrice) * qty;
      console.log("orderPrice :" + orderPrice);
      console.log("qty :" + qty);
      console.log("TP :" + newTp);
      setTemporarySlTpInfos((prevInfos) => ({
        ...prevInfos,
        tp: ""+newTp,
      }));
    },
    [orderPrice, qty]
  );
  
  const onUpdateSl = useCallback(
    function onUpdateSl(tpPrice: string) {
      const newSl = (orderPrice - Number(tpPrice)) * qty;
      console.log("SL :" + newSl);
      setTemporarySlTpInfos((prevInfos) => ({
        ...prevInfos,
        sl: ""+newSl,
      }));
    },
    [orderPrice, qty]
  );

  useEffect(() => {
    const newTp = (Number(temporarySlTpInfos.tpTriggerPrice) - orderPrice) * qty;
    setTemporarySlTpInfos((prevInfos) => ({
      ...prevInfos,
      tp: "" + newTp,
    }));
  }, [temporarySlTpInfos.tpTriggerPrice, orderPrice, qty]);

  useEffect(() => {
    const newSl = (orderPrice - Number(temporarySlTpInfos.slTriggerPrice)) * qty;
    setTemporarySlTpInfos((prevInfos) => ({
      ...prevInfos,
      sl: "" + newSl,
    }));
  }, [temporarySlTpInfos.slTriggerPrice, orderPrice, qty]);

  function onConfirm() {
    setSlTpInfos(temporarySlTpInfos);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div onClick={() => setIsOpen(true)}>{children}</div>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>Add TP/SL</DialogHeader>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Order Price</p>
            <p>{orderPrice}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Qty</p>
            <p>{qty}</p>
          </div>
          <div className="text-end">
            <p className="text-muted-foreground">Last traded price</p>
            <p>{orderPrice}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-muted-foreground">Applicable to</p>
          <p>Entire position</p>
        </div>

        <div className="mt-4 text-sm">
          <p className="text-muted-foreground">Take Profit-Trigger by P&L</p>
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
                  placeholder="Profit"
                  value={""+temporarySlTpInfos.tp}
                  onChange={onUpdateTp}
                />
                <span>USD</span>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <div className="mt-4 text-sm">
          <p className="text-muted-foreground">Stop Loss-Trigger by P&L</p>
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
                  placeholder="Loss"
                  value={""+Number(temporarySlTpInfos.sl)}
                  onChange={onUpdateSl}
                />
                <span>USD</span>
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
              setTemporarySlTpInfos({
                sl: "",
                slTriggerPrice: "",
                tp: "",
                tpTriggerPrice: "",
              });
              setSlTpInfos({
                sl: "",
                slTriggerPrice: "",
                tp: "",
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

export default SlTpModal;
