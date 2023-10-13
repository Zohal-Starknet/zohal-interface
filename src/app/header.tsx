// TODO : See correct usage of Next Image component, Image optimization is not a free feature we actually need to pay for it on Vercel

import Link from "next/link";
import { ConnectButton } from "./zohal-modal";
import Divider from "./ui/divider";

/* eslint-disable @next/next/no-img-element */
export default function Header() {
  return (
    <>
      <header className="flex-initial flex justify-between items-center p-3">
        <Link href="/">
          <img className="w-28" src="/logo.svg" alt="Zohal" />
        </Link>
        <ConnectButton />
      </header>
      <Divider />
    </>
  );
}
