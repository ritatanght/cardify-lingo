import type { Metadata } from "next";
import { roboto } from "./ui/fonts";
import Providers from "./providers";
import Header from "./ui/components/Header";
import { getAllCategories } from "./lib/api";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.scss";
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Cardify",
  description: "Satisfy all your learning needs",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getAllCategories();
  return (
    <html lang="en">
      <body
        className={`${roboto.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <Header categories={categories} />
          <div className="content-container">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
