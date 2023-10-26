"use client";

import { connectors } from "@satoru/utils/connectors";
import { StarknetConfig } from "@starknet-react/core";
import { type PropsWithChildren } from "react";

import { ZohalKitProvider } from "./zohal-modal";

export default function Providers(props: PropsWithChildren) {
  const { children } = props;

  return (
    <StarknetConfig autoConnect connectors={connectors}>
      <ZohalKitProvider>{children}</ZohalKitProvider>
    </StarknetConfig>
  );
}
