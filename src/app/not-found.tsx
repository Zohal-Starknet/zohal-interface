/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { getTradePath } from "./_helpers/routes";
import Button from "./_ui/button";

export default function CustomNotFoundPage() {
  return (
    <div className="flex flex-auto items-center justify-center">
      <div className="flex flex-col items-center gap-10">
        <h1 className="flex items-center text-9xl font-medium">
          <span>COMING S</span>
          <span>
            <img alt="Zohal" className="w-32" src="/logo.png" />
          </span>
          <span>
            <img alt="Zohal" className="w-32" src="/logo.png" />
          </span>
          <span>N</span>
        </h1>
        {/* <div className="flex flex-col items-center gap-5">
          <h2 className="text-4xl font-normal">
            We couldn&apos;t find that page
          </h2>
          <p>The page you are looking for doesn&apos;t exist</p>
        </div> */}
        <Button asChild variant="secondary">
          <Link href={getTradePath()}>Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
