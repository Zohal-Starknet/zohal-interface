"use client";

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { useAccount } from "@starknet-react/core";

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

interface ModalContextValue {
  accountModalOpen: boolean;
  connectModalOpen: boolean;
  openAccountModal?: () => void;
  openConnectModal?: () => void;
}

const ModalContext = createContext<ModalContextValue>({
  accountModalOpen: false,
  connectModalOpen: false,
});

export function ModalProvider({ children }: PropsWithChildren) {
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

  const { address } = useAccount({
    // TODO @YohanTz: onConnect / onDisconnect callbacks below
    // onConnect() {
    //   closeConnectModal();
    //   closeAccountModal();
    // },
    // onDisconnect() {
    //   closeConnectModal();
    //   closeAccountModal();
    // }
  });

  return (
    <ModalContext.Provider
      value={useMemo(
        () => ({
          accountModalOpen,
          connectModalOpen,
          openAccountModal:
            address !== undefined ? openAccountModal : undefined,
          openConnectModal:
            address === undefined ? openConnectModal : undefined,
        }),
        [
          address,
          accountModalOpen,
          connectModalOpen,
          openAccountModal,
          openConnectModal,
        ]
      )}
    >
      {children}
      <ConnectModal onClose={closeConnectModal} open={connectModalOpen} />
      <AccountModal onClose={closeAccountModal} open={accountModalOpen} />
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
