import { Playpen_Sans, Roboto } from "next/font/google";

export const playpen = Playpen_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});
export const roboto = Roboto({ style: "normal", weight:["400","700"], subsets: ["latin"] });