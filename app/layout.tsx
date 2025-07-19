import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ThemeRegistry from '../components/ThemeRegistry'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Uma Musume Racing Championship',
  description: '🏇 Live racing point system with trainer standings, race results, and championship rankings. Experience the excitement of Uma Musume racing!',
  openGraph: {
    title: 'Uma Musume Racing Championship',
    description: '🏇 Live racing point system with trainer standings, race results, and championship rankings. Experience the excitement of Uma Musume racing!',
    images: [
      {
        url: 'https://uma.team-one.app/uma-background.jpg',
        width: 900,
        height: 600,
        alt: 'Uma Musume Racing Championship - Colorful horse girls in dynamic racing poses with confetti',
      },
    ],
    type: 'website',
    siteName: 'Uma Musume Racing Championship',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uma Musume Racing Championship',
    description: '🏇 Live racing point system with trainer standings, race results, and championship rankings.',
    images: ['https://uma.team-one.app/uma-background.jpg'],
  },
  keywords: ['Uma Musume', 'Racing', 'Championship', 'Horse Girls', 'Anime', 'Gaming', 'Leaderboard'],
  authors: [{ name: 'Uma Musume Racing Team' }],
  creator: 'Uma Musume Racing Team',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  )
} 