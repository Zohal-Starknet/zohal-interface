import { EllipsisVerticalIcon } from "@heroicons/react/24/solid"
import { TOKENS } from "@zohal/app/_helpers/tokens";
import clsx from "clsx";

/* eslint-disable @next/next/no-img-element */
export default function Position() {
  // TODO @YohanTz: Add ? icon to explain each of the table header

  return (
    <table className="mt-6 w-full">
      <thead className="border-b border-neutral-800 text-left">
        <tr className="text-[#bcbcbd] flex space-x-2.5">
          <th className={clsx(tableHeaderCommonStyles, "w-64")}>Position</th>
          <th className={clsx(tableHeaderCommonStyles, "hidden sm:block w-48")}>Net Value</th>
          <th className={clsx(tableHeaderCommonStyles, "hidden md:block w-24 lg:hidden")}>Size</th>
          <th className={clsx(tableHeaderCommonStyles, "hidden xl:block w-24")}>Collateral</th>
          <th className={clsx(tableHeaderCommonStyles, "hidden xl:block")}>Entry Price</th>
          <th className={clsx(tableHeaderCommonStyles, "hidden xl:block")}>Market Price</th>
          <th className={clsx(tableHeaderCommonStyles, "hidden xl:block")}>Liquidation Price</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((data, index) => {
          const isLongPosition = data.positionType === "long";

          return (
            <tr className="border-b border-neutral-800 text-sm flex items-center space-x-2.5" key={index}>
              <td className="flex gap-4 py-4 items-center w-64">
                <div className="flex-shrink-0 rounded-full h-fit border border-neutral-600 p-1">
                  <img
                    alt={`${data.token.name} icon`}
                    className="w-8 rounded-full"
                    src={data.token.icon}
                  />
                </div>
                <div>
                  {data.position}
                  <span
                    className={clsx(
                      "ml-4 rounded-sm px-1 py-0.5 text-xs font-semibold text-black",
                      isLongPosition ? "bg-[#40B68B]" : "bg-[#FF5354]",
                    )}
                  >
                    {isLongPosition ? "LONG" : "SHORT"}
                  </span>
                  <br />
                  <span className="text-sm text-[#bcbcbd]">
                    {data.leverage}
                  </span>
                </div>
              </td>
              <td className="py-4 hidden sm:block w-48">
                {data.netValue.price}
                <br />
                <span
                  className={clsx(
                    "text-sm",
                    isLongPosition ? "text-[#40B68B]" : "text-[#FF5354]",
                  )}
                >
                  {data.netValue.purcentage}
                </span>
              </td>
              <td className="hidden md:block w-24 lg:hidden xl:w-24">{data.size}</td>
              <td className="hidden w-24 xl:block">
                {data.collateral.dollar}
                <br />
                <span className="text-sm text-[#bcbcbd]">
                  {data.collateral.token}
                </span>
              </td>
              <td className="hidden xl:block w-28">{data.entryPrice}</td>
              <td className="hidden xl:block w-28">{data.markPrice}</td>
              <td className="hidden xl:block w-24">{data.liquidationPrice}</td>
              <td className="flex-1 flex justify-end">
                <div className="flex items-center w-fit space-x-1">
                  <button className="rounded-lg border border-[#363636] bg-[#1b1d22] px-3 py-2">
                    Close
                  </button>
                  <button className="xl:hidden"><EllipsisVerticalIcon className="h-8 w-6 text-white" /></button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const tableHeaderCommonStyles = "pb-4 font-normal";

const tableData = [
  {
    collateral: { dollar: "$48.35", token: "48 USDC" },
    entryPrice: "$1581.35",
    leverage: "20.00×",
    liquidationPrice: "$1581.35",
    markPrice: "$1581.35",
    netValue: { price: "$2.38", purcentage: "(+$0.03 / +1.26%)" },
    position: "ETH-USD",
    positionType: "short",
    size: "$48.35",
    token: TOKENS.ETH,
  },
  {
    collateral: { dollar: "$18.35", token: "18 USDC" },
    entryPrice: "$2581.35",
    leverage: "10.00×",
    liquidationPrice: "$2581.35",
    markPrice: "$2581.35",
    netValue: { price: "$2.38", purcentage: "(-$0.03 / -1.26%)" },
    position: "BTC-USD",
    positionType: "long",
    size: "$18.35",
    token: TOKENS.WBTC,
  },
  {
    collateral: { dollar: "$48.35", token: "48 USDC" },
    entryPrice: "$1581.35",
    leverage: "2.00×",
    liquidationPrice: "$1581.35",
    markPrice: "$1581.35",
    netValue: { price: "$2.38", purcentage: "(+$10.03 / -5.26%)" },
    position: "ETH-USD",
    positionType: "short",
    size: "$48.35",
    token: TOKENS.ETH,
  },
];
