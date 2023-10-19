import { PropsWithChildren } from "react";

import { ModalProvider } from "./ModalContext";

const ZohalKitProvider = (props: PropsWithChildren) => {
  const { children } = props;
  return <ModalProvider>{children}</ModalProvider>;
};

export { ZohalKitProvider };
