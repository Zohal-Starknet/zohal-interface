import { InjectedConnector } from "@starknet-react/core";

export const connectors = [
  new InjectedConnector({ options: { id: "braavos" } }),
  new InjectedConnector({ options: { id: "argentX" } }),
];
