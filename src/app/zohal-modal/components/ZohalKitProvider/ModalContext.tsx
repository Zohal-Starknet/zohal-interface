"use client";

import { useAccount } from "@starknet-react/core";
import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { AccountModal } from "../AccountModal/AccountModal";
import { ConnectModal } from "../ConnectModal/ConnectModal";

function useModalState() {
  const [isModalOpen, setModalOpen] = useState(false);

  return {
    closeModal: useCallback(() => setModalOpen(false), []),
    isModalOpen,
    openModal: useCallback(() => setModalOpen(true), []),
  };
}

type ModalContextValue = {
  /** Is the account modal currently open */
  accountModalOpen: boolean;
  /** Is the connect modal currently open */
  connectModalOpen: boolean;
  /** Function used to open the account modal */
  openAccountModal?: () => void;
  /** Function used to open the connect modal */
  openConnectModal?: () => void;
};

const ModalContext = createContext<ModalContextValue>({
  accountModalOpen: false,
  connectModalOpen: false,
});

export function ModalProvider(props: PropsWithChildren) {
  const { children } = props;
  const {
    closeModal: closeAccountModal,
    isModalOpen: accountModalOpen,
    openModal: openAccountModal,
  } = useModalState();

  const {
    closeModal: closeConnectModal,
    isModalOpen: connectModalOpen,
    openModal: openConnectModal,
  } = useModalState();

  const { address, connector } = useAccount({
    // TODO @YohanTz: implement and use onConnect / onDisconnect callbacks in @starknet-react/core
  });

  const value = useMemo(
    () => ({
      accountModalOpen,
      connectModalOpen,
      openAccountModal: address !== undefined ? openAccountModal : undefined,
      openConnectModal: address === undefined ? openConnectModal : undefined,
    }),
    [
      address,
      accountModalOpen,
      connectModalOpen,
      openAccountModal,
      openConnectModal,
    ],
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ConnectModal onClose={closeConnectModal} open={connectModalOpen} />
      <AccountModal
        connectorId={connector?.id}
        onClose={closeAccountModal}
        open={accountModalOpen}
      />
    </ModalContext.Provider>
  );
}

export function useAccountModal() {
  const modalContext = useContext(ModalContext);

  if (modalContext === undefined) {
    throw new Error("useAccountModal must be used within a ZhoalKitProvider");
  }

  const { accountModalOpen, openAccountModal } = modalContext;

  return { accountModalOpen, openAccountModal };
}

export function useConnectModal() {
  const modalContext = useContext(ModalContext);

  if (modalContext === undefined) {
    throw new Error("useConnectModal must be used within a ZohalKitProvider");
  }

  const { connectModalOpen, openConnectModal } = modalContext;

  return { connectModalOpen, openConnectModal };
}
