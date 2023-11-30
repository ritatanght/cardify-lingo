import type { Metadata } from 'next'
import { roboto } from './ui/fonts'
import './globals.scss'
import Header from './ui/Header'
import axios from "axios";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export const metadata: Metadata = {
  title: 'Cardify',
  description: 'Satisfy all your learning needs',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const { data } = await axios.get(
      "http://localhost:8080/api/categories"
    );
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}><Header categories={data}/>{children}</body>
    </html>
  );
}
