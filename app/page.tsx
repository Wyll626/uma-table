import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UMA Table App',
  description: 'A Next.js 14 application',
}

import RacingTables from '../components/DataTable';

export default function Home() {
  return (
    <main 
      className="min-h-screen p-8"
      style={{
        backgroundImage: 'url(/bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Uma Musume Racing Championship
            </h1>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
          <RacingTables />
        </div>
      </div>
    </main>
  )
} 