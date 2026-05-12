import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Bloom Wallet - The Last Wallet You\'ll Ever Need',
  description: 'Biometric-first Solana wallet with decentralized recovery and Living Will inheritance functionality. Self-custody, no seed phrases.',
  generator: 'v0.app',
  openGraph: {
    title: 'Bloom Wallet',
    description: 'The last wallet you\'ll ever need — even after you\'re gone.',
    type: 'website',
  },
  icons: {
    icon: '/images/bloom-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
