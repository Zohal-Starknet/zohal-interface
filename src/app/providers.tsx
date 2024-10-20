"use client";

import { sepolia, mainnet } from "@starknet-react/chains";
import {
  InjectedConnector,
  StarknetConfig,
  blastProvider,
  publicProvider,
} from "@starknet-react/core";
import { type PropsWithChildren } from "react";

import { ZohalKitProvider } from "./zohal-modal";

export const connectors = [
  new InjectedConnector({
    options: { id: "braavos", name: "Braavos" },
  }),
  new InjectedConnector({
    options: { id: "argentX", name: "Argent X" },
  }),
];

const provider = blastProvider({
  apiKey: "9b95b6b2-ba0f-4fc8-b110-a87d2bda503b",
});

export default function Providers(props: PropsWithChildren) {
  const { children } = props;

  return (
    <StarknetConfig
      autoConnect
      chains={[mainnet]}
      connectors={connectors}
      provider={provider}
    >
      <ZohalKitProvider>{children}</ZohalKitProvider>
    </StarknetConfig>
  );
}
