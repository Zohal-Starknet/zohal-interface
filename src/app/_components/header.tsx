import Link from "next/link";
import Image from "next/image"; // Import the next/image component

import Divider from "../_ui/divider";
import { ConnectButton } from "../zohal-modal";
import Navigation from "./navigation";
import { ThemeToggle } from "./theme-toggle";
import {FaucetButton} from "@zohal/app/ui/FaucetButton"

export default function Header() {
  return (
    <>
      <header className="flex flex-initial items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <div className="flex-shrink-0" style={{ position: "relative", width: 40, height: 40 }}>
              <Image
                alt="Zohal"
                className="rounded-lg"
                src="/logo.png"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </Link>
          <Navigation />
        </div>
        <div className="items-cneter flex gap-2">
          <FaucetButton/>
          <ConnectButton />
        </div>
      </header>
      <Divider />
    </>
  );
}
