"use client";

import ChartPanel from "./_components/chart-panel";
import Footer from "./_components/footer";
import PositionPanel from "./_components/position-panel";
import TradeSwapPanel from "./_components/trade-swap-panel";
import { useState, useEffect } from "react";

// Import the Dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../_ui/Modal";

import { ec, hash } from 'starknet';

// Function to convert string to BigInt
const stringToBigInt = (str) => {
  return BigInt('0x' + Buffer.from(str).toString('hex'));
};

// Convert ISO string timestamp to BigInt using Unix timestamp
const timestampToBigInt = (timestamp) => {
  return BigInt(Math.floor(new Date(timestamp).getTime() / 1000));
};


export default function Home() {
  const [activePanel, setActivePanel] = useState("chart");
  const [showRiskModal, setShowRiskModal] = useState(true); 

  const handleAccept = async () => {
    try {
      // Data to sign (e.g., userId, timestamp, and other relevant data)
      const userId = 123; // Replace this with actual user ID from context or state
      const timestamp = new Date().toISOString();
      // Convert elements to BigInt where necessary
      const message = [
            BigInt(userId), 
            timestampToBigInt(timestamp)
      ];

      // Generate the message hash using Starknet.js
      const messageHash = hash.computeHashOnElements(message);

      console.log("Message hash:", messageHash);

      // Private key for signing (in a real-world case, you'd retrieve this securely)
      const privateKey = "0x583eab8ae730da509e9271eb9922efd9bb802b2d4697295e8c16eabba5674b"; // Replace with your actual private key
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
        console.error("Failed to save acceptance.");
      }
    } catch (error) {
      console.error("An error occurred while saving acceptance:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Risk Modal */}
      <Dialog open={showRiskModal} onOpenChange={setShowRiskModal}>
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
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Accept and Proceed
          </button>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <main className="hidden lg:flex flex-auto flex-col lg:flex-row lg:overflow-hidden h-full">
        <div className="flex flex-auto flex-col h-full">
          <ChartPanel />
          <PositionPanel className="hidden lg:block h-full" />
        </div>
        <TradeSwapPanel />
      </main>

      {/* Mobile View */}
      <div className="flex-auto lg:hidden">
        {activePanel === "chart" && <ChartPanel />}
        {activePanel === "position" && <PositionPanel />}
        {activePanel === "trade" && <TradeSwapPanel />}
      </div>

      <Footer activePanel={activePanel} setActivePanel={setActivePanel} />
    </div>
  );
}
