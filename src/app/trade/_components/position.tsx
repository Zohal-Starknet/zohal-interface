import { Tokens } from "@zohal/app/_helpers/tokens";
import { type PropsWithClassName } from "@zohal/app/_lib/utils";
import clsx from "clsx";

/* eslint-disable @next/next/no-img-element */
export default function Position({ className }: PropsWithClassName) {
  // TODO @YohanTz: Add ? icon to explain each of the table header

  return (
    <div className={clsx("w-full", className)}>
      <table className="w-full">
        <thead className="border-b border-neutral-800 text-left">
          <tr className="text-[#bcbcbd]">
            <th className={tableHeaderCommonStyles}>Position</th>
            <th className={tableHeaderCommonStyles}>Net Value</th>
            <th className={tableHeaderCommonStyles}>Size</th>
            <th className={tableHeaderCommonStyles}>Collateral</th>
            <th className={tableHeaderCommonStyles}>Entry Price</th>
            <th className={tableHeaderCommonStyles}>Market Price</th>
            <th className={tableHeaderCommonStyles}>Liquidation Price</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data, index) => {
            const isLongPosition = data.positionType === "long";

            return (
              <tr className="border-b border-neutral-800 text-sm" key={index}>
                <td className="flex gap-4 py-4">
                  <div className="flex-shrink-0 rounded-full border border-neutral-600 p-1">
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
                <td className="py-4">
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
                <td className="pr-6">{data.size}</td>
                <td>
                  {data.collateral.dollar}
                  <br />
                  <span className="text-sm text-[#bcbcbd]">
                    {data.collateral.token}
                  </span>
                </td>
                <td>{data.entryPrice}</td>
                <td>{data.markPrice}</td>
                <td>{data.liquidationPrice}</td>
                <td className="text-right">
                  <button className="rounded-lg border border-[#363636] bg-[#1b1d22] px-3 py-2">
                    Close
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
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
    token: Tokens.ETH,
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
    token: Tokens.WBTC,
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
    token: Tokens.ETH,
  },
];
