// TODO : See correct usage of Next Image component, Image optimization is not a free feature we actually need to pay for it on Vercel
/* eslint-disable @next/next/no-img-element */
export default function Header() {
  return (
    <header className="flex-initial ">
      <div className="py-2 px-3">
        <img className="w-28" src="/logo.svg" alt="Zohal" />
      </div>
      <hr className="h-0 w-full bg-[#2A2E37] border-[#2A2E37] border-solid" />
    </header>
  );
}
