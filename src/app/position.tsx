/* eslint-disable @next/next/no-img-element */
export default function Position() {
  // TODO @YohanTz: Add ? icon to explain each of the table header

  return (
    <table className="mt-8 w-full">
      <thead className="border-b border-neutral-800 text-left">
        <tr className="text-[#bcbcbd]">
          <th className="pb-4 font-normal">Position</th>
          <th className="pb-4 font-normal">Net Value</th>
          <th className="pb-4 font-normal">Size</th>
          <th className="pb-4 font-normal">Collateral</th>
          <th className="pb-4 font-normal">Entry Price</th>
          <th className="pb-4 font-normal">Market Price</th>
          <th className="pb-4 font-normal">Liquidation Price</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((data, index) => {
          return (
            <tr className="border-b border-neutral-800 text-sm" key={index}>
              <td className="flex gap-4 py-4">
                <div className="flex-shrink-0 rounded-full border border-neutral-600 p-1">
                  <img
                    alt={`${data.token}`}
                    className="w-8 rounded-full"
                    src={`/tokens/${data.token}.png`}
                  />
                </div>
                <div>
                  {data.position}
                  {index === 1 ? (
                    <span className="ml-4 rounded-sm bg-[#40B68B] px-1 py-0.5 text-xs font-semibold text-black">
                      LONG
                    </span>
                  ) : (
                    <span className="ml-4 rounded-sm bg-[#FF5354] px-1 py-0.5 text-xs font-semibold text-black">
                      SHORT
                    </span>
                  )}
                  <br />
                  <span className="text-sm text-[#bcbcbd]">
                    {data.leverage}
                  </span>
                </div>
              </td>
              <td className="py-4">
                {data.netValue.price}
                <br />
                {index === 1 ? (
                  <span className="text-sm text-[#FF5354]">
                    {data.netValue.purcentage}
                  </span>
                ) : (
                  <span className="text-sm text-[#40B68B]">
                    {data.netValue.purcentage}
                  </span>
                )}
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
  );
}

const tableData = [
  {
    collateral: { dollar: "$48.35", token: "48 USDC" },
    entryPrice: "$1581.35",
    leverage: "20.00×",
    liquidationPrice: "$1581.35",
    markPrice: "$1581.35",
    netValue: { price: "$2.38", purcentage: "(+$0.03 / +1.26%)" },
    position: "ETH-USD",
    size: "$48.35",
    token: "ethereum",
  },
  {
    collateral: { dollar: "$18.35", token: "18 USDC" },
    entryPrice: "$2581.35",
    leverage: "10.00×",
    liquidationPrice: "$2581.35",
    markPrice: "$2581.35",
    netValue: { price: "$2.38", purcentage: "(-$0.03 / -1.26%)" },
    position: "BTC-USD",
    size: "$18.35",
    token: "bitcoin",
  },
  {
    collateral: { dollar: "$48.35", token: "48 USDC" },
    entryPrice: "$1581.35",
    leverage: "2.00×",
    liquidationPrice: "$1581.35",
    markPrice: "$1581.35",
    netValue: { price: "$2.38", purcentage: "(+$10.03 / -5.26%)" },
    position: "ETH-USD",
    size: "$48.35",
    token: "white_ethereum",
  },
];
