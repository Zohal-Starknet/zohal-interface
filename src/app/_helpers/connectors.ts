import { InjectedConnector } from "@starknet-react/core";

export const connectors = [
  new InjectedConnector({ options: { id: "argentX" } }),
  new InjectedConnector({ options: { id: "braavos" } }),
];

export const connector_id_to_img: Record<string, string> = {
  argentX: "/logos/argentx.svg",
  braavos: "/logos/braavos.svg",
};

export const connector_id_to_name: Record<string, string> = {
  argentX: "Argent X",
  braavos: "Braavos",
};
