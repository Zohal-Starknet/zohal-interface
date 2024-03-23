import { Markets } from "@zohal/app/_helpers/markets";
import { notFound } from "next/navigation";

interface MarketPageProps {
  params: {
    marketAddress: `0x${string}`;
  };
}
export default function MarketsPage({
  params: { marketAddress },
}: MarketPageProps) {
  console.log(Markets, marketAddress);
  if (Markets[marketAddress] === undefined) {
    notFound();
  }

  return <div></div>;
}
