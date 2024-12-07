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
import { useEffect, useState } from "react";

import { ec, hash } from "starknet";

// Function to convert string to BigInt
const stringToBigInt = (str: String) => {
  return BigInt("0x" + Buffer.from(str).toString("hex"));
};

// Convert ISO string timestamp to BigInt using Unix timestamp
const timestampToBigInt = (timestamp: any) => {
  return BigInt(Math.floor(new Date(timestamp).getTime() / 1000));
};

type ConnectModalProps = {
  /** Callback function called when the modal is closed */
  onClose: () => void;
  /** Whether the modal is open or not */
  open: boolean;
};

export function ConnectModal(props: ConnectModalProps) {
  const { onClose, open } = props;
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const [showRiskModal, setShowRiskModal] = useState(false);

  // Function to handle acceptance of the risk modal
  const handleAccept = async () => {
    try {
      // Data to sign (e.g., userId, timestamp, and other relevant data)
      const userId = 123; // Replace this with actual user ID from context or state
      const timestamp = new Date().toISOString();
      // Convert elements to BigInt where necessary
      const message = [BigInt(userId), timestampToBigInt(timestamp)];

      // Generate the message hash using Starknet.js
      const messageHash = hash.computeHashOnElements(message);

      // Private key for signing (in a real-world case, you'd retrieve this securely)
      const privateKey =
        "0x583eab8ae730da509e9271eb9922efd9bb802b2d4697295e8c16eabba5674b"; // Replace with your actual private key
      const signature = ec.starkCurve.sign(privateKey, messageHash);

      // Prepare data to send to the API
      const requestData = {
        acceptedAt: timestamp,
        userId: userId,
        signature: signature.toCompactHex(),
      };

      // Call API to save the acceptance and the signature in your DB
      const response = await fetch("/api/accept-risk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        // Successfully saved, hide the modal
        setShowRiskModal(false);
      } else {
        setShowRiskModal(false);
        console.error("Failed to save acceptance.");
      }
    } catch (error) {
      console.error("An error occurred while saving acceptance:", error);
    }
  };

  useEffect(() => {
    if (address !== undefined) {
      setShowRiskModal(true); // Show the risk modal when connected
    }
  }, [address]);

  return (
    <>
      {/* Wallet Connection Modal */}
      <Dialog modal onOpenChange={(open) => !open && onClose()} open={open}>
        <DialogContent className="max-w-sm bg-black text-white">
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
                    onClick={() => {
                      connect({ connector });
                      onClose();
                    }}
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

      {/* Risk Modal */}
      {/* <Dialog open={showRiskModal} onOpenChange={setShowRiskModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Important Notice</DialogTitle>
            <DialogDescription>
              Please be aware that these contracts are experimental and involve
              certain risks. By proceeding, you acknowledge the risk and accept
              the terms.
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white"
          >
            Accept and Proceed
          </button>
        </DialogContent>
      </Dialog> */}
    </>
  );
}
