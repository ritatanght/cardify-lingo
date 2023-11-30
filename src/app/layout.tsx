import type { Metadata } from 'next'
import { roboto } from './ui/fonts'
import './globals.scss'


export const metadata: Metadata = {
  title: 'Cardify',
  description: 'Satisfy all your learning needs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>{children}</body>
    </html>
  );
}
