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
                className="bg-secondary flex h-10 items-center rounded-xl p-0.5"
                onClick={openAccountModal}
              >
                {/* TODO @YohanTz: Display Skeleton ? */}
                {displayBalance !== undefined && (
                  <span className="text-secondary-foreground hidden whitespace-nowrap px-2 text-sm sm:block">
                    {displayBalance}
                  </span>
                )}
                <div className="bg-background flex h-full items-center gap-2 rounded-[10px] px-2">
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
                className="bg-secondary flex h-10 items-center rounded-xl px-4 transition-colors hover:bg-neutral-800"
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
