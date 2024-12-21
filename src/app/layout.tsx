import type { Metadata } from "next";
import { robotoMono } from "@zohal/app/_helpers/fonts";
import Header from "./_components/header";
import "./globals.css";
import Providers from "./providers";
import { ThemeProvider } from "./_components/theme-provider";
import { Toaster } from "./_ui/toaster";
import { PriceProvider } from "./trade/_hooks/use-market-data";


export const metadata: Metadata = {
  description:
    "Next-generation Perpetual Exchange on Starknet. Revolutionizing User Experience.",
  title: "Zohal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={robotoMono.className} lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-black text-white lg:overflow-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="root"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-full min-h-screen flex-col">
            <Providers>
            <PriceProvider>
              <Header />
              <div className="flex-auto">{children}</div>
              </PriceProvider>
            </Providers>
          </div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
