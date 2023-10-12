import { Roboto_Mono } from "next/font/google";

// TODO - Link this to the Tailwind Font
export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
