import ZohPoolsTable from "./_components/zoh-pools-table";

export default function EarnPage() {
  return (
    <main className="mx-auto mt-6 w-full max-w-6xl">
      <div>
        <h1 className="text-3xl">ZOH Pools</h1>
        <p className="text-sm text-[#A5A5A7]">
          Purchase ZOH Tokens to earn fees from swaps and leverage trading.
        </p>
      </div>

      <ZohPoolsTable className="mt-12" />
    </main>
  );
}
