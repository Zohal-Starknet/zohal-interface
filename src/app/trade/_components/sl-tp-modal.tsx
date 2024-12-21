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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@zohal/app/_ui/dropdown-menu";
import { ChevronRight } from "@zohal/app/_ui/icons";
import { Tokens } from "@zohal/app/_helpers/tokens";

export type SlTpInfos = {
  tpTriggerPrice: string;
  tp: string;
  size_delta_usd_tp: string;
  collateral_delta_tp: string;
  slTriggerPrice: string;
  sl: string;
  size_delta_usd_sl: string;
  collateral_delta_sl: string;
};

type SlTpCheckboxProps = {
  slTpInfos: SlTpInfos;
  setSlTpInfos(arg0: SlTpInfos): void;
  orderPrice: number;
  qty: number;
  isLong: boolean;
};

function SlTpModal({
  children,
  slTpInfos,
  setSlTpInfos,
  orderPrice,
  qty,
  isLong,
}: PropsWithChildren<SlTpCheckboxProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [applicableEntirePosition, setApplicableEntirePosition] =
    useState(true);
  const [positionSizeTp, setPositionSizeTp] = useState("");
  const [positionSizeSl, setPositionSizeSl] = useState("");

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
    [orderPrice, qty],
  );

  const onUpdateSlTriggerPrice = useCallback(
    function onUpdateSlTriggerPrice(slPrice: string) {
      const newSlTriggerPrice = slPrice;
      setTemporarySlTpInfos((prevInfos) => {
        const newInfos = { ...prevInfos, slTriggerPrice: newSlTriggerPrice };
        onUpdateSl(newInfos.slTriggerPrice);
        return newInfos;
      });
    },
    [orderPrice, qty],
  );

  const onUpdateTp = useCallback(
    function onUpdateTp(tpPrice: string) {
      if (tpPrice != "") {
        const newTp = isLong
          ? (Number(tpPrice) - orderPrice) * qty
          : orderPrice - Number(tpPrice) * qty;
        setTemporarySlTpInfos((prevInfos) => ({
          ...prevInfos,
          tp: "" + newTp,
        }));
      }
    },
    [orderPrice, qty],
  );

  const onUpdateSl = useCallback(
    function onUpdateSl(tpPrice: string) {
      if (tpPrice != "") {
        const newSl = isLong
          ? (Number(tpPrice) - orderPrice) * qty
          : (orderPrice - Number(tpPrice)) * qty;
        console.log("SL :" + newSl);
        setTemporarySlTpInfos((prevInfos) => ({
          ...prevInfos,
          sl: "" + newSl,
        }));
      }
    },
    [orderPrice, qty],
  );

  useEffect(() => {
    const newTp = isLong
      ? (Number(temporarySlTpInfos.tpTriggerPrice) - orderPrice) * qty
      : (orderPrice - Number(temporarySlTpInfos.tpTriggerPrice)) * qty;
    setTemporarySlTpInfos((prevInfos) => ({
      ...prevInfos,
      tp: "" + newTp,
    }));
  }, [temporarySlTpInfos.tpTriggerPrice, orderPrice, qty]);

  useEffect(() => {
    const newSl = isLong
      ? (Number(temporarySlTpInfos.slTriggerPrice) - orderPrice) * qty
      : (orderPrice - Number(temporarySlTpInfos.slTriggerPrice)) * qty;
    setTemporarySlTpInfos((prevInfos) => ({
      ...prevInfos,
      sl: "" + newSl,
    }));
  }, [temporarySlTpInfos.slTriggerPrice, orderPrice, qty]);

  const [isTransitioning, setIsTransitioning] = useState(false);

  function onConfirm() {
    setSlTpInfos(temporarySlTpInfos); // Met à jour les infos
    setTimeout(() => {
      setIsOpen(false); // Ferme la modale après un petit délai pour éviter les conflits avec le DOM
    }, 10); // 10ms suffisent pour sécuriser la fermeture
  }

  function onPositionSizeTp(newSize: string) {
    setPositionSizeTp(newSize);
    setTemporarySlTpInfos((prevInfos) => ({
      ...prevInfos,
      size_delta_usd_tp: "" + newSize,
    }));
  }

  function onPositionSizeSl(newSize: string) {
    setPositionSizeSl(newSize);
    setTemporarySlTpInfos((prevInfos) => ({
      ...prevInfos,
      size_delta_usd_sl: "" + newSize,
    }));
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // Ajout d'une vérification pour s'assurer que le DOM est intact
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        <div
          onClick={(e) => {
            e.stopPropagation(); // Empêche tout événement inattendu
            setIsOpen(true);
          }}
        >
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className={`max-w-lg bg-black ${!isOpen ? "hidden" : ""}`}>
        <DialogHeader>Add TP/SL</DialogHeader>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Order Price</p>
            <p>{orderPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Qty</p>
            <p>{qty.toFixed(4)}</p>
          </div>
          <div className="text-end">
            <p className="text-muted-foreground">Type</p>
            {isLong ? <p>Long</p> : <p>Short</p>}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-muted-foreground">Applicable to</p>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              {applicableEntirePosition ? (
                <button className="flex transition-colors duration-200 hover:text-yellow-500">
                  Entire Position
                  <ChevronRight className="rotate-90" label="chevron" />
                </button>
              ) : (
                <button className="flex transition-colors duration-200 hover:text-yellow-500">
                  Partial Position
                  <ChevronRight className="rotate-90" label="chevron" />
                </button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="space-y-1">
              <DropdownMenuItem
                onClick={() => {
                  setApplicableEntirePosition(true);
                }}
              >
                Entire Position
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setApplicableEntirePosition(false);
                }}
              >
                Partial Position
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 text-sm">
          <p className="text-muted-foreground">Take Profit-Trigger by P&L</p>
          <div className="mt-1.5">
            <div className="grid grid-cols-[2fr_1fr] gap-4">
              <Input
                className="h-12 w-full rounded-md border border-border bg-secondary px-2 text-xs"
                placeholder="Trigger price"
                value={temporarySlTpInfos.tpTriggerPrice}
                onChange={onUpdateTpTriggerPrice}
                disabled={false}
              />
              <div className="flex h-12 w-full items-center overflow-hidden rounded-md border border-border bg-secondary pr-2">
                <Input
                  className="h-full w-full bg-secondary px-2 text-xs"
                  placeholder="Profit"
                  value={
                    "" + Number(temporarySlTpInfos.tp).toFixed(2).toString()
                  }
                  onChange={onUpdateTp}
                  disabled={true}
                />
                <span>USD</span>
              </div>
            </div>
            {applicableEntirePosition ? (
              <></>
            ) : (
              <div className="mt-2 rounded-md border border-border bg-secondary p-2">
                <div className="flex items-center justify-between">
                  {positionSizeTp ? (
                    <label className="block text-xs">
                      Reduce: ${Number(positionSizeTp)}
                    </label>
                  ) : (
                    <label className="block text-xs">Reduce</label>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Max: {(qty * orderPrice).toFixed(2)} USD
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between bg-transparent">
                  <Input
                    className="w-full bg-transparent text-lg"
                    id="Reduce position"
                    onChange={onPositionSizeTp}
                    placeholder="0.00"
                    value={positionSizeTp}
                    disabled={false}
                  />
                  <div className="mr-4 mt-1 flex items-center gap-1">
                    <img
                      alt="USDC"
                      className="h-6 w-6"
                      src={Tokens.USDC.icon}
                    />
                    USD
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Divider />

        <div className="mt-4 text-sm">
          <p className="text-muted-foreground">Stop Loss-Trigger by P&L</p>
          <div className="mt-1.5">
            <div className="grid grid-cols-[2fr_1fr] gap-4">
              <Input
                className="h-12 w-full rounded-md border border-border bg-secondary px-2 text-xs"
                placeholder="Trigger price"
                value={temporarySlTpInfos.slTriggerPrice}
                onChange={onUpdateSlTriggerPrice}
                disabled={false}
              />
              <div className="flex h-12 w-full items-center overflow-hidden rounded-md border border-border bg-secondary pr-2">
                <Input
                  className="h-full w-full bg-secondary px-2 text-xs"
                  placeholder="Loss"
                  value={
                    "" + Number(temporarySlTpInfos.sl).toFixed(2).toString()
                  }
                  onChange={onUpdateSl}
                  disabled={true}
                />
                <span>USD</span>
              </div>
            </div>
            {applicableEntirePosition ? (
              <></>
            ) : (
              <div className="mt-2 rounded-md border border-border bg-secondary p-2">
                <div className="flex items-center justify-between">
                  {positionSizeSl ? (
                    <label className="block text-xs">
                      Reduce: ${Number(positionSizeSl)}
                    </label>
                  ) : (
                    <label className="block text-xs">Reduce</label>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Max: {(qty * orderPrice).toFixed(2)} USD
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between bg-transparent">
                  <Input
                    className="w-full bg-transparent text-lg"
                    id="Reduce position"
                    onChange={onPositionSizeSl}
                    placeholder="0.00"
                    value={positionSizeSl}
                    disabled={false}
                  />
                  <div className="mr-4 mt-1 flex items-center gap-1">
                    <img
                      alt="USDC"
                      className="h-6 w-6"
                      src={Tokens.USDC.icon}
                    />
                    USD
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <Button variant="success" onClick={onConfirm}>
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
                size_delta_usd_sl: "",
                size_delta_usd_tp: "",
                collateral_delta_tp: "",
                collateral_delta_sl: ""
              });
              setSlTpInfos({
                sl: "",
                slTriggerPrice: "",
                tp: "",
                tpTriggerPrice: "",
                size_delta_usd_sl: "",
                size_delta_usd_tp: "",
                collateral_delta_tp: "",
                collateral_delta_sl: ""
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
