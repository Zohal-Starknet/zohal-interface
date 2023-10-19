import { PropsWithChildren } from "react";

import { ModalProvider } from "./ModalContext";

function ZohalKitProvider(props: PropsWithChildren) {
  const { children } = props;
  return <ModalProvider>{children}</ModalProvider>;
}

export { ZohalKitProvider };
