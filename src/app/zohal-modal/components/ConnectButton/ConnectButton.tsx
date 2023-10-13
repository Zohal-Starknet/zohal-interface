"use client";

import {
  connector_id_to_img,
  connector_id_to_name,
} from "@satoru/utils/connectors";
import { CustomConnectButton } from "./CustomConnectButton";

/** This component should be an exported version of CustomConnectButton, with customizable propos
 * such as showBalance, label etc
 */
export function ConnectButton() {
  return (
    <CustomConnectButton>
      {({
        address,
        connectorId,
        displayBalance,
        truncatedAddress,
        starkName,
        openAccountModal,
        openConnectModal,
        ready,
      }) => {
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              className: "opacity-0 pointer-events-none select-none",
            })}
          >
            {address !== undefined && (
              <button
                onClick={openAccountModal}
                className="flex items-center rounded-xl font-semibold h-10 bg-[#1d1f23] p-0.5"
              >
                {displayBalance !== undefined && (
                  <span className="whitespace-nowrap px-2 text-neutral-300 text-sm">
                    {displayBalance}
                  </span>
                )}
                <div className="flex h-full items-center rounded-[10px] bg-[#2f3339] px-2 gap-2">
                  {connectorId !== undefined && (
                    <img
                      alt={`${connectorId}`}
                      className="h-6 w-6 rounded-full"
                      src={connector_id_to_img[connectorId]}
                    />
                  )}
                  {starkName ?? truncatedAddress}
                </div>
              </button>
            )}
            {address === undefined && (
              <button
                onClick={openConnectModal}
                className="bg-[#1d1f23] px-4 h-10 flex items-center rounded-xl font-seimbold"
              >
                Connect wallet
              </button>
            )}
          </div>
        );
      }}
    </CustomConnectButton>
  );
}
