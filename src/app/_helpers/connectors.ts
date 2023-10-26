import { InjectedConnector } from "@starknet-react/core";

export const connectors = [
  new InjectedConnector({ options: { id: "braavos" } }),
  new InjectedConnector({ options: { id: "argentX" } }),
];

export const connector_id_to_img: Record<string, string> = {
  argentX: "/logos/argentx.png",
  braavos: "/logos/braavos.png",
};

export const connector_id_to_name: Record<string, string> = {
  argentX: "Argent X",
  braavos: "Braavos",
};
