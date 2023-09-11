"use client";

import { PropsWithChildren } from "react";
import { connectors } from "@satoru/utils/connectors";
import { StarknetConfig } from "@starknet-react/core";

export default function Providers(props: PropsWithChildren) {
  const { children } = props;

  return (
    <StarknetConfig autoConnect connectors={connectors}>
      {children}
    </StarknetConfig>
  );
}
