import type { Metadata } from "next";import { roboto } from "@/lib/fonts";
import Providers from "./providers";
import Header from "@/components/header/Header";
import { getAllLanguages } from "@/db/queries/languages";
import "@/styles/globals.scss";

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
          <Header languages={languages || []} />
          <div className="md:px-6 md:py-8">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
