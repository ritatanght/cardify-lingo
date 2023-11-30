import type { Metadata } from "next";
import { roboto } from "./ui/fonts";
import "./globals.scss";
import Header from "./ui/Header";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import { getAllCategories } from "./lib/api";

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
        <Header categories={categories} />
        <div className="content-container">{children}</div>
      </body>
    </html>
  );
}
