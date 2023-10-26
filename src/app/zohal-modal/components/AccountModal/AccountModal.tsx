import { useConnectors } from "@starknet-react/core";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@zohal/app/_ui/Modal";
import Button from "@zohal/app/_ui/button";

import { useDisplayBalance } from "../../hooks/useDisplayBalance";
import { useDisplayName } from "../../hooks/useDisplayName";

type AccountModalProps = {
  /** Callback function called when the modal is closed */
  onClose: () => void;
  /** Whethere the modal is open or not */
  open: boolean;
};
export function AccountModal(props: AccountModalProps) {
  const { onClose, open } = props;
  const { disconnect } = useConnectors();

  const { starkName, truncatedAddress } = useDisplayName();
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
          <DialogTitle>Connected</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col">
          <div>
            <p className="text-center text-lg">{displayName}</p>
          </div>
          <p className="text-muted-foreground text-center text-sm">
            {displayBalance}
          </p>
        </div>
        <Button className="w-full" onClick={onDisconnect} variant="secondary">
          Disconnect
        </Button>
      </DialogContent>
    </Dialog>
  );
}
