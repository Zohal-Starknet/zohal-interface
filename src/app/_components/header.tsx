// TODO : See correct usage of Next Image component, Image optimization is not a free feature we actually need to pay for it on Vercel

import Link from "next/link";

import Divider from "../_ui/divider";
import { ConnectButton } from "../zohal-modal";
import Navigation from "./navigation";
import { ThemeToggle } from "./theme-toggle";
import {FaucetButton} from "@zohal/app/ui/FaucetButton"

/* eslint-disable @next/next/no-img-element */
export default function Header() {
  return (
    <>
      <header className="flex flex-initial items-center justify-between p-1.5">
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
          <ConnectButton />
        </div>
      </header>
      <Divider />
    </>
  );
}
