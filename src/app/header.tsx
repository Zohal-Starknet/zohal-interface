// TODO : See correct usage of Next Image component, Image optimization is not a free feature we actually need to pay for it on Vercel

import Link from "next/link";

import Divider from "./ui/divider";
import { ConnectButton } from "./zohal-modal";

/* eslint-disable @next/next/no-img-element */
export default function Header() {
  return (
    <>
      <header className="flex flex-initial items-center justify-between p-5">
        <Link href="/">
          <img alt="Zohal" className="w-28" src="/logo.svg" />
        </Link>
        <ConnectButton />
      </header>
      <Divider />
    </>
  );
}
