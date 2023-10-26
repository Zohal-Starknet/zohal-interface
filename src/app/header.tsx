// TODO : See correct usage of Next Image component, Image optimization is not a free feature we actually need to pay for it on Vercel

import Link from "next/link";

import Divider from "./ui/divider";
import { ConnectButton } from "./zohal-modal";

/* eslint-disable @next/next/no-img-element */
export default function Header() {
  return (
    <>
      <header className="flex flex-initial items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <img
              alt="Zohal"
              className="w-10 rotate-[-35deg] rounded-lg"
              src="/logo.png"
            />
          </Link>
          <nav>
            <ul className="flex gap-2">
              <li>
                <Link className="rounded-md px-2 py-2" href="/trade">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  className="rounded-md bg-[#1d1f23] px-2 py-2"
                  href="/trade"
                >
                  Trade
                </Link>
              </li>
              <li>
                <Link className="rounded-md px-2 py-2" href="/trade">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link className="rounded-md px-2 py-2" href="/trade">
                  Rewards
                </Link>
              </li>
              <li>
                <Link className="rounded-md px-2 py-2" href="/trade">
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
