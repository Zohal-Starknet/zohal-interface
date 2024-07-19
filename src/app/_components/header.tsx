// TODO : See correct usage of Next Image component, Image optimization is not a free feature we actually need to pay for it on Vercel

import Link from "next/link";

import Divider from "../_ui/divider";
import { ConnectButton } from "../zohal-modal";
import Navigation from "./navigation";
import { ThemeToggle } from "./theme-toggle";

/* eslint-disable @next/next/no-img-element */
export default function Header() {
  return (
    <>
      <header className="flex flex-initial items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Link className="flex-shrink-0" href="/">
            <img
              alt="Zohal"
              className="w-10 rotate-[-35deg] rounded-lg"
              src="/logo.png"
            />
          </Link>
          <Navigation />
        </div>
        <div className="items-cneter flex gap-2">
          <button  className="flex h-10 items-center rounded-xl bg-secondary px-4 transition-colors hover:bg-neutral-800"> Faucet </button>
          <ConnectButton />
        </div>
      </header>
      <Divider />
    </>
  );
}
