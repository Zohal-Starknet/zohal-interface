import { PropsWithChildren } from "react";

import { ModalProvider } from "./ModalContext";

const ZohalKitProvider = ({ children }: PropsWithChildren) => {
  return (
    <>
      <ModalProvider>{children}</ModalProvider>
    </>
  );
};

export { ZohalKitProvider };
