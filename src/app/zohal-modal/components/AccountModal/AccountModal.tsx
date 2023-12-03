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
import { CopyIcon, ExternalLinkIcon } from "@zohal/app/_ui/icons";
import Link from "next/link";

import { useDisplayName } from "../../hooks/useDisplayName";

type AccountModalProps = {
  /** ID of the connector */
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

  const displayName = starkName ?? truncatedAddress;

  function onDisconnect() {
    onClose();
    disconnect();
  }

  // TODO @YohanTz: rely only on onDisconnect and onConnect in ModalContext.tsx
  // TODO : handle last transactions done and list them

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
        <div className="flex flex-col gap-4 rounded-md border border-neutral-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                alt={connectorId}
                className="h-5 w-5"
                src={
                  connectorId !== undefined
                    ? connector_id_to_img[connectorId]
                    : "/logo.svg"
                }
              />
              <p className="text-center text-lg">{displayName}</p>
            </div>
            <Button
              className="text-xs"
              onClick={onDisconnect}
              size="sm"
              variant="link"
            >
              Disconnect
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="inline-flex w-1/2 gap-1 text-xs transition hover:scale-105"
              onClick={async () => {
                if (fullAddress === undefined) {
                  return;
                }

                // TODO : Add Toasts for Success and Failure cases
                await navigator.clipboard.writeText(fullAddress);
              }}
              size="lg"
              variant="secondary"
            >
              <span>
                <CopyIcon className="w-4" label="copy-icon" />
              </span>
              <span>Copy address</span>
            </Button>
            <Button
              asChild
              className="inline-flex w-1/2 text-xs transition hover:scale-105"
              size="lg"
              variant="secondary"
            >
              <Link
                href={`https://starkscan.co/${
                  fullAddress !== undefined ? `/contract/${fullAddress}` : ""
                }`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="flex gap-1">
                  <ExternalLinkIcon className="h-4 w-4" label="External" />
                  See on the explorer
                </span>
              </Link>
            </Button>
          </div>
        </div>
        <h3 className="mt-4">Your transactions</h3>
        <p className="text-center text-sm text-[#A5A5A7]">
          No transaction found.
        </p>
      </DialogContent>
    </Dialog>
  );
}
