import type { Metadata } from "next";
import { roboto } from "./ui/fonts";
import Providers from "./providers";
import Header from "./ui/components/Header";
import { getAllLanguages } from "./lib/api";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Cardify",
  description: "Satisfy all your learning needs",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const languages = await getAllLanguages();

  return (
    <html lang="en">
      <body
        className={`${roboto.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <Header languages={languages} />
          <div className="content-container md:px-6 md:py-8">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
