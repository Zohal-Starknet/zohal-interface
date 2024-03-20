"use client";

import { goerli } from "@starknet-react/chains";
import {
  InjectedConnector,
  StarknetConfig,
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

export default function Providers(props: PropsWithChildren) {
  const { children } = props;

  return (
    <StarknetConfig
      autoConnect
      chains={[goerli]}
      connectors={connectors}
      provider={publicProvider()}
    >
      <ZohalKitProvider>{children}</ZohalKitProvider>
    </StarknetConfig>
  );
}
