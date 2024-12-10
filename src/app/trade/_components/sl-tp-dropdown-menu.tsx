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
import useFormatNumber from "../_hooks/use-format-number";

export type SlTpInfos = {
  tpTriggerPrice: string;
  tp: string;
  size_delta_usd_tp: string;
  slTriggerPrice: string;
  sl: string;
  size_delta_usd_sl: string;
};

type SlTpCheckboxProps = {
  slTpInfos: SlTpInfos;
  setSlTpInfos(arg0: SlTpInfos): void;
  orderPrice: number;
  qty: number;
  isLong: boolean;
};

function SlTpDropdownMenu({
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
  const { formatNumberWithoutExponent } = useFormatNumber();

  const [temporarySlTpInfos, setTemporarySlTpInfos] =
    useState<SlTpInfos>(slTpInfos);

  const onUpdateTpTriggerPrice = useCallback(
    function onUpdateTpTriggerPrice(tpPrice: string) {
      const newTpTriggerPrice = tpPrice.replace(",", ".");
      if (/^\d*([.]?\d*)$/.test(newTpTriggerPrice)) {
        const newInfos: SlTpInfos = { ...slTpInfos, tpTriggerPrice: newTpTriggerPrice };
        onUpdateTp(newInfos.tpTriggerPrice);
        setSlTpInfos(newInfos);
      }
    },
    [orderPrice, qty],
  );

  const onUpdateSlTriggerPrice = useCallback(
    function onUpdateSlTriggerPrice(slPrice: string) {
      const newSlTriggerPrice = slPrice.replace(",", ".");
      if (/^\d*([.]?\d*)$/.test(newSlTriggerPrice)) {
        const newInfos : SlTpInfos = { ...slTpInfos, slTriggerPrice: newSlTriggerPrice };
        onUpdateSl(newInfos.slTriggerPrice);
        setSlTpInfos(newInfos);
      }
    },
    [orderPrice, qty],
  );

  const onUpdateTp = useCallback(
    function onUpdateTp(tpPrice: string) {
      const newTpPrice = tpPrice.replace(",", ".");
      if (/^\d*([.]?\d*)$/.test(newTpPrice)) {
        if (newTpPrice != "") {
          const newTp = isLong
            ? (Number(newTpPrice) - orderPrice) * qty
            : orderPrice - Number(newTpPrice) * qty;
          const newInfos : SlTpInfos = { ...slTpInfos, tp: "" + newTp };
          setSlTpInfos(newInfos)
        }
      }
    },
    [orderPrice, qty],
  );

  const onUpdateSl = useCallback(
    function onUpdateSl(slPrice: string) {
      const newSlPrice = slPrice.replace(",", ".");
      if (/^\d*([.]?\d*)$/.test(newSlPrice)) {
        if (newSlPrice != "") {
          const newSl = isLong
            ? (Number(newSlPrice) - orderPrice) * qty
            : (orderPrice - Number(newSlPrice)) * qty;
            const newInfos : SlTpInfos = { ...slTpInfos, sl: "" + newSl };
            setSlTpInfos(newInfos)
        }
      }
    },
    [orderPrice, qty],
  );

  useEffect(() => {
    const newTp = slTpInfos.tpTriggerPrice === "" ? 0
      : (isLong
      ? (Number(slTpInfos.tpTriggerPrice) - orderPrice) * qty
      : (orderPrice - Number(slTpInfos.tpTriggerPrice)) * qty); 
    const newInfos : SlTpInfos = { ...slTpInfos, tp: "" + newTp };
    setSlTpInfos(newInfos)
  }, [slTpInfos.tpTriggerPrice, orderPrice, qty]);

  useEffect(() => {
    const newSl = slTpInfos.slTriggerPrice === "" ? 0
      : (isLong
      ? (Number(slTpInfos.slTriggerPrice) - orderPrice) * qty
      : (orderPrice - Number(slTpInfos.slTriggerPrice)) * qty);
    const newInfos : SlTpInfos = { ...slTpInfos, sl: "" + newSl };
    setSlTpInfos(newInfos)
  }, [slTpInfos.slTriggerPrice, orderPrice, qty]);

  const [isTransitioning, setIsTransitioning] = useState(false);

  function onConfirm() {
    setSlTpInfos(slTpInfos); // Met à jour les infos
    setTimeout(() => {
      setIsOpen(false); // Ferme la modale après un petit délai pour éviter les conflits avec le DOM
    }, 10); // 10ms suffisent pour sécuriser la fermeture
  }

  function onPositionSizeTp(newSize: string) {
    const newSizeFormatted = newSize.replace(",", ".");
      if (/^\d*([.]?\d*)$/.test(newSizeFormatted)) {
      setPositionSizeTp(newSizeFormatted);
    const newInfos : SlTpInfos = { ...slTpInfos, size_delta_usd_tp: "" + newSizeFormatted };
    setSlTpInfos(newInfos)
    }
  }

  function onPositionSizeSl(newSize: string) {
    const newSizeFormatted = newSize.replace(",", ".");
      if (/^\d*([.]?\d*)$/.test(newSizeFormatted)) {
        setPositionSizeSl(newSizeFormatted);
        const newInfos : SlTpInfos = { ...slTpInfos, size_delta_usd_sl: "" + newSizeFormatted };
        setSlTpInfos(newInfos)
      }
  }

  const handleDropdownClick = () => {
    const newInfos : SlTpInfos = { ...slTpInfos, size_delta_usd_sl: "", size_delta_usd_tp: "" };
    setSlTpInfos(newInfos)
    setPositionSizeTp("");
    setPositionSizeSl("");
    setApplicableEntirePosition(true);
  };

  return (
    <div className={`bg-black`}>
      <div className="mt-1 flex items-center justify-between text-sm">
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
            <DropdownMenuItem onClick={handleDropdownClick}>
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

      <div className="mt-1 text-sm">
        <p className="text-muted-foreground">Take Profit-Trigger by P&L</p>
        <div className="mt-1.5">
          <div className="grid grid-cols-[2fr_1fr] gap-4">
            <Input
              className="h-12 w-full rounded-md border border-border bg-secondary px-2 text-xs"
              placeholder="Trigger price"
              value={slTpInfos.tpTriggerPrice}
              onChange={onUpdateTpTriggerPrice}
              disabled={false}
            />
            <div className="flex h-12 w-full items-center overflow-hidden rounded-md border border-border bg-secondary pr-2">
              <Input
                className="h-full w-full bg-secondary px-2 text-xs"
                placeholder="Profit"
                value={"" + Number(slTpInfos.tp).toFixed(2).toString()}
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
                  Max: {formatNumberWithoutExponent(Number((qty * orderPrice).toFixed(2)))} USD
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
                  <img alt="USDC" className="h-6 w-6" src={Tokens.USDC.icon} />
                  USD
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Divider />

      <div className="mt-1 text-sm">
        <p className="text-muted-foreground">Stop Loss-Trigger by P&L</p>
        <div className="mt-1.5">
          <div className="grid grid-cols-[2fr_1fr] gap-4">
            <Input
              className="h-12 w-full rounded-md border border-border bg-secondary px-2 text-xs"
              placeholder="Trigger price"
              value={slTpInfos.slTriggerPrice}
              onChange={onUpdateSlTriggerPrice}
              disabled={false}
            />
            <div className="flex h-12 w-full items-center overflow-hidden rounded-md border border-border bg-secondary pr-2">
              <Input
                className="h-full w-full bg-secondary px-2 text-xs"
                placeholder="Loss"
                value={"" + Number(slTpInfos.sl).toFixed(2).toString()}
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
                  Max: {formatNumberWithoutExponent(Number((qty * orderPrice).toFixed(2)))} USD
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
                  <img alt="USDC" className="h-6 w-6" src={Tokens.USDC.icon} />
                  USD
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlTpDropdownMenu;
