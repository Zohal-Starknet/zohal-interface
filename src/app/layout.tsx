import type { Metadata } from "next";
import { robotoMono } from "@zohal/app/_helpers/fonts";
import { Toaster } from "sonner";
import Header from "./_components/header";
import "./globals.css";
import Providers from "./providers";
import { ThemeProvider } from "./_components/theme-provider";
import { Toast } from "./_ui/toast";

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
      <body className="lg:overflow-hidden bg-black text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-full flex-col min-h-screen">
            <Providers>
              <Header />
              <div className="flex-auto">
                {children}
              </div>
              <Toaster position="bottom-right" />
            </Providers>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
