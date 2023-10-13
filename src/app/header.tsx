// TODO : See correct usage of Next Image component, Image optimization is not a free feature we actually need to pay for it on Vercel

import Link from "next/link";
import { ConnectButton } from "./zohal-modal";
import Divider from "./ui/divider";

/* eslint-disable @next/next/no-img-element */
export default function Header() {
  return (
    <>
      <header className="flex-initial flex justify-between items-center p-3">
        <div className="flex gap-4 items-center">
          <Link href="/">
            <img className="w-10 rounded-lg" src="/logo.png" alt="Zohal" />
          </Link>
          <nav>
            <ul className="flex gap-2">
              <li>
                <Link href="/trade" className="px-2 py-2 rounded-md">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/trade"
                  className="bg-[#1d1f23] px-2 py-2 rounded-md"
                >
                  Trade
                </Link>
              </li>
              <li>
                <Link href="/trade" className="px-2 py-2 rounded-md">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/trade" className="px-2 py-2 rounded-md">
                  Rewards
                </Link>
              </li>
              <li>
                <Link href="/trade" className="px-2 py-2 rounded-md">
                  Docs
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <ConnectButton />
      </header>
      <Divider />
    </>
  );
}
