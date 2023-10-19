import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import Header from "./header";
import { robotoMono } from "@satoru/utils/fonts";

export const metadata: Metadata = {
  title: "Satoru",
  description:
    "Next-generation Perpetual Exchange on Starknet. Revolutionizing User Experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={robotoMono.className}>
      <body>
        <div className="flex flex-col h-full">
          <Providers>
            <Header />
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
