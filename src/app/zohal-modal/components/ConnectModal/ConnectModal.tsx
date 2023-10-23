import { useEffect } from "react";

import { useAccount, useConnectors } from "@starknet-react/core";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@satoru/app/ui/Modal";
import { connector_id_to_name } from "@satoru/utils/connectors";

type ConnectModalProps = {
  /** Callback function called when the modal is closed */
  onClose: () => void;
  /** Whethere the modal is open or not */
  open: boolean;
};
export function ConnectModal(props: ConnectModalProps) {
  const { onClose, open } = props;
  const { address } = useAccount();
  const { connect, connectors } = useConnectors();

  // TODO @YohanTz: rely only on onDisconnect and onConnect in ModalContext.tsx
  useEffect(() => {
    if (address !== undefined) {
      onClose();
    }
  }, [address, onClose]);

  return (
    // TODO @YohanTz: only rely on open
    <Dialog open={open} modal onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect a wallet</DialogTitle>
          <DialogDescription>
            Please, connect a wallet to start using Zohal
          </DialogDescription>
        </DialogHeader>
        <ul className="mt-4 flex w-full flex-col gap-2">
          {connectors.map((connector) => {
            return (
              <li key={connector.id}>
                <button
                  onClick={() => connect(connector)}
                  className="w-full rounded-md p-2 bg-[#1d1f23]"
                >
                  {connector_id_to_name[connector.id]}
                </button>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
