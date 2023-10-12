// TODO : See correct usage of Next Image component, Image optimization is not a free feature we actually need to pay for it on Vercel

import Divider from "./ui/divider";

/* eslint-disable @next/next/no-img-element */
export default function Header() {
  return (
    <header className="flex-initial ">
      <div className="py-2 px-3">
        <img className="w-28" src="/logo.svg" alt="Zohal" />
      </div>
      <Divider />
    </header>
  );
}
