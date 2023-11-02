"use client";

import { connector_id_to_img } from "@zohal/app/_helpers/connectors";

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
        openAccountModal,
        openConnectModal,
        ready,
        starkName,
        truncatedAddress,
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
                className="flex h-10 items-center rounded-xl bg-[#1d1f23] p-0.5"
                onClick={openAccountModal}
              >
                {displayBalance !== undefined && (
                  <span className="hidden whitespace-nowrap px-2 text-sm text-neutral-300 sm:block">
                    {displayBalance}
                  </span>
                )}
                <div className="flex h-full items-center gap-2 rounded-[10px] bg-[#2f3339] px-2">
                  {connectorId !== undefined && (
                    // eslint-disable-next-line @next/next/no-img-element
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
                className="flex h-10 items-center rounded-xl bg-[#1d1f23] px-4"
                onClick={openConnectModal}
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
