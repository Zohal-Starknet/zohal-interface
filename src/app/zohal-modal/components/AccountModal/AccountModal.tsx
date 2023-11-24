/* eslint-disable @next/next/no-img-element */
import { useConnectors } from "@starknet-react/core";
import { connector_id_to_img } from "@zohal/app/_helpers/connectors";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@zohal/app/_ui/Modal";
import Button from "@zohal/app/_ui/button";
import {
  CopyIcon,
  DisconnectIcon,
  ExternalLinkIcon,
} from "@zohal/app/_ui/icons";
import Link from "next/link";

import { useDisplayBalance } from "../../hooks/useDisplayBalance";
import { useDisplayName } from "../../hooks/useDisplayName";

type AccountModalProps = {
  connectorId: string | undefined;
  /** Callback function called when the modal is closed */
  onClose: () => void;
  /** Whethere the modal is open or not */
  open: boolean;
};

export function AccountModal(props: AccountModalProps) {
  const { connectorId, onClose, open } = props;
  const { disconnect } = useConnectors();

  const { fullAddress, starkName, truncatedAddress } = useDisplayName();
  const displayBalance = useDisplayBalance();

  const displayName = starkName ?? truncatedAddress;

  function onDisconnect() {
    onClose();
    disconnect();
  }

  // TODO @YohanTz: rely only on onDisconnect and onConnect in ModalContext.tsx

  return (
    <Dialog
      modal
      onOpenChange={(open) => !open && onClose()}
      // TODO @YohanTz: only rely on open
      open={open}
    >
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>Wallet</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center">
          <div className="mb-2 rounded-lg bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 to-indigo-500 p-4">
            <img
              src={
                connectorId !== undefined
                  ? connector_id_to_img[connectorId]
                  : "/logo.svg"
              }
              alt={connectorId}
              className="h-11 w-11"
            />
          </div>
          <div className="flex items-center gap-1">
            <p className="text-center text-lg">{displayName}</p>
            <Button className="h-8 w-8" size="icon" variant="ghost">
              <Link
                href={`https://starkscan.co/${
                  fullAddress !== undefined ? `/contract/${fullAddress}` : ""
                }`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ExternalLinkIcon className="h-5 w-5" label="External" />
              </Link>
            </Button>
          </div>
          <p className="text-muted-foreground text-center text-sm">
            {displayBalance}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={async () => {
              if (fullAddress === undefined) {
                return;
              }

              // TODO : Add Toasts for Success and Failure cases
              await navigator.clipboard.writeText(fullAddress);
            }}
            className="inline-flex w-1/2 gap-1 transition hover:scale-105"
            size="lg"
            variant="secondary"
          >
            <span>
              <CopyIcon className="w-4" label="copy-icon" />
            </span>
            <span>Copy address</span>
          </Button>
          <Button
            className="inline-flex w-1/2 gap-1 transition hover:scale-105"
            onClick={onDisconnect}
            size="lg"
            variant="secondary"
          >
            <span>
              <DisconnectIcon className="w-4" label="disconnect-icon" />
            </span>
            <span>Disconnect</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
