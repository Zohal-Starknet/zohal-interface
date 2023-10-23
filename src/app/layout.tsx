import type { Metadata } from "next";

import { robotoMono } from "@satoru/utils/fonts";

import "./globals.css";
import Header from "./header";
import Providers from "./providers";

export const metadata: Metadata = {
  description: "Satoru",
  title: "Satoru",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={robotoMono.className} lang="en">
      <body>
        <div className="flex h-full flex-col">
          <Providers>
            <Header />
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
