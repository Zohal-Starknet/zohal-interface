// TODO : See correct usage of Next Image component, Image optimization is not a free feature we actually need to pay for it on Vercel

import Link from "next/link";
import { ConnectButton } from "./zohal-modal";

/* eslint-disable @next/next/no-img-element */
export default function Header() {
  return (
    <>
      <header className="flex-initial flex justify-between items-center p-5">
        <Link href="/">
          <img className="w-28" src="/logo.svg" alt="Zohal" />
        </Link>
        <ConnectButton />
      </header>
      <hr className="h-0 w-full bg-[#2A2E37] border-[#2A2E37] border-solid" />
    </>
  );
}
