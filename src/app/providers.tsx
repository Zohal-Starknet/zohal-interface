"use client";

import { goerli } from "@starknet-react/chains";
import {
  StarknetConfig,
  argent,
  braavos,
  publicProvider,
} from "@starknet-react/core";
import { type PropsWithChildren } from "react";

import { ZohalKitProvider } from "./zohal-modal";

const starknetConfig = {
  chains: [goerli],
  connectors: [argent(), braavos()],
  provider: publicProvider(),
};

export default function Providers(props: PropsWithChildren) {
  const { children } = props;

  return (
    <StarknetConfig
      autoConnect
      chains={starknetConfig.chains}
      connectors={starknetConfig.connectors}
      provider={starknetConfig.provider}
    >
      <ZohalKitProvider>{children}</ZohalKitProvider>
    </StarknetConfig>
  );
}
