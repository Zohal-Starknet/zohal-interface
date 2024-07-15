import { useAccount, useConnect } from "@starknet-react/core";
import { connector_id_to_name } from "@zohal/app/_helpers/connectors";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@zohal/app/_ui/Modal";
import Button from "@zohal/app/_ui/button";
import { useEffect } from "react";

type ConnectModalProps = {
  /** Callback function called when the modal is closed */
  onClose: () => void;
  /** Whethere the modal is open or not */
  open: boolean;
};
export function ConnectModal(props: ConnectModalProps) {
  const { onClose, open } = props;
  const { address } = useAccount();
  const { connect, connectors } = useConnect();

  // TODO @YohanTz: rely only on onDisconnect and onConnect in ModalContext.tsx
  useEffect(() => {
    if (address !== undefined) {
      onClose();
    }
  }, [address, onClose]);

  return (
    // TODO @YohanTz: only rely on open
    <Dialog modal onOpenChange={(open) => !open && onClose()} open={open}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Connect a wallet</DialogTitle>
          {/* <DialogDescription>
            Please, connect a wallet to start using Zohal
          </DialogDescription> */}
        </DialogHeader>
        <ul className="mt-4 flex w-full flex-col gap-2">
          {connectors.map((connector) => {
            return (
              <li key={connector.id}>
                <Button
                  className="relative w-full"
                  disabled={!connector.available}
                  onClick={() => connect({ connector })}
                  variant="secondary"
                >
                  <img
                    src={connector.icon.dark}
                    className="absolute left-3 h-5"
                  />
                  {connector_id_to_name[connector.id]}
                </Button>
              </li>
            );
          })}
        </ul>

        <p className="text-xs text-muted-foreground">
          By using Zohal, you agree to our Terms of use and Privacy policy
        </p>
      </DialogContent>
    </Dialog>
  );
}
