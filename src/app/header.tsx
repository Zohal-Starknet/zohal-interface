// TODO : See correct usage of Next Image component, Image optimization is not a free feature we actually need to pay for it on Vercel

import Link from "next/link";

import Divider from "./ui/divider";
import { ConnectButton } from "./zohal-modal";

/* eslint-disable @next/next/no-img-element */
export default function Header() {
  return (
    <>
      <header className="flex-initial flex justify-between items-center p-4">
        <div className="flex gap-4 items-center">
          <Link href="/">
            <img
              alt="Zohal"
              className="w-10 rounded-lg rotate-[-35deg]"
              src="/logo.png"
            />
          </Link>
          <nav>
            <ul className="flex gap-2">
              <li>
                <Link className="px-2 py-2 rounded-md" href="/trade">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  className="bg-[#1d1f23] px-2 py-2 rounded-md"
                  href="/trade"
                >
                  Trade
                </Link>
              </li>
              <li>
                <Link className="px-2 py-2 rounded-md" href="/trade">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link className="px-2 py-2 rounded-md" href="/trade">
                  Rewards
                </Link>
              </li>
              <li>
                <Link className="px-2 py-2 rounded-md" href="/trade">
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
