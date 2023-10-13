const tableData = [
  {
    position: "ETH-USD",
    leverage: "20.00×",
    netValue: { price: "$2.38", purcentage: "(-$0.03 / -1.26%)" },
    size: "$48.35",
    collateral: { dollar: "$48.35", token: "48 USDC" },
    entryPrice: "$1581.35",
    markPrice: "$1581.35",
    liquidationPrice: "$1581.35",
  },
  {
    position: "ETH-USD",
    leverage: "20.00×",
    netValue: { price: "$2.38", purcentage: "(-$0.03 / -1.26%)" },
    size: "$48.35",
    collateral: { dollar: "$48.35", token: "48 USDC" },
    entryPrice: "$1581.35",
    markPrice: "$1581.35",
    liquidationPrice: "$1581.35",
  },
  {
    position: "ETH-USD",
    leverage: "20.00×",
    netValue: { price: "$2.38", purcentage: "(-$0.03 / -1.26%)" },
    size: "$48.35",
    collateral: { dollar: "$48.35", token: "48 USDC" },
    entryPrice: "$1581.35",
    markPrice: "$1581.35",
    liquidationPrice: "$1581.35",
  },
];

export default function Position() {
  // TODO @YohanTz: Add ? icon to explain each of the table header

  return (
    <table className="w-full mt-8">
      <thead className="text-left">
        <tr className="text-[#bcbcbd]">
          <th className="font-normal">Position</th>
          <th className="font-normal">Net Value</th>
          <th className="font-normal">Size</th>
          <th className="font-normal">Collateral</th>
          <th className="font-normal">Entry Price</th>
          <th className="font-normal">Mark Price</th>
          <th className="font-normal">Liquidation Price</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((data, index) => {
          return (
            <tr key={index} className="text-sm">
              <td className="py-4">
                {data.position}
                {
                  <span className="ml-4 px-2 py-0.5 text-xs font-semibold rounded-sm bg-[#40B68B]">
                    LONG
                  </span>
                }
                <br />
                <span className="text-sm text-[#bcbcbd]">{data.leverage}</span>
              </td>
              <td className="py-4">
                {data.netValue.price}
                <br />
                {index === 1 ? (
                  <span className="text-[#FF5354] text-sm">
                    {data.netValue.purcentage}
                  </span>
                ) : (
                  <span className="text-[#40B68B] text-sm">
                    {data.netValue.purcentage}
                  </span>
                )}
              </td>
              <td>{data.size}</td>
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
                <button className="py-2 px-3 rounded-lg bg-[#1b1d22] border border-[#363636]">
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
