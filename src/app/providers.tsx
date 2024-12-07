"use client";

import { mainnet, sepolia } from "@starknet-react/chains";
import {
  InjectedConnector,
  StarknetConfig,
  argent,
  blastProvider,
  braavos,
  publicProvider,
} from "@starknet-react/core";
import { type PropsWithChildren } from "react";

import { ZohalKitProvider } from "./zohal-modal";

export const connectors = [argent(), braavos()];

const provider = blastProvider({
  apiKey: "9b95b6b2-ba0f-4fc8-b110-a87d2bda503b",
});
export default function Providers(props: PropsWithChildren) {
  const { children } = props;
  return (
    <StarknetConfig
      autoConnect
      chains={[sepolia]}
      connectors={connectors}
      provider={provider}
    >
      <ZohalKitProvider>{children}</ZohalKitProvider>
    </StarknetConfig>
  );
}
