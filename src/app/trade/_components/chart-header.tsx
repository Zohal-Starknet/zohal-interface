import { Tokens } from "@zohal/app/_helpers/tokens";

/* eslint-disable @next/next/no-img-element */
export default function ChartHeader() {
  return (
    <div className="flex h-[4.75rem] items-center pl-4">
      <div className="flex h-full items-center gap-4 border-r border-[#2A2E37] pr-10">
        <img
          alt={`${Tokens.WBTC.name} icon`}
          className="w-8"
          src={Tokens.WBTC.icon}
        />
        <span className="whitespace-nowrap">WBTC-USD</span>
      </div>
      <div className="flex h-full flex-1 items-center gap-8 overflow-auto">
        <div className="flex items-center gap-4 pl-5">
          <div className="flex flex-col">
            <span className="text-white">$1,544.27</span>
            <span className="text-sm text-[#A5A5A7]">$1,544.24</span>
          </div>
          <span className="text-xxs rounded-md bg-[#40B68B] px-2 py-1 text-sm font-semibold text-black">
            +0.71%
          </span>
        </div>
        <VerticalDivider />
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#A5A5A7]">24h Change</span>
          <span className="text-[#40B68B]">$24.80(+0.71%)</span>
        </div>
        <VerticalDivider />
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#A5A5A7]">24h High</span>
          <span className="text-white">$1,594.30</span>
        </div>
        <VerticalDivider />
        <div className="flex flex-col gap-1 pr-4">
          <span className="text-xs text-[#A5A5A7]">24h Low</span>
          <span className="text-white">$1,504.30</span>
        </div>
      </div>
    </div>
  );
}

function VerticalDivider() {
  return <div className="h-6 w-[1px] bg-[#2A2E37]" />;
}
