import { Metadata } from 'next'
import OrishasGrid from '@/components/sections/orishas/OrishasGrid'
import BackgroundEffects from '@/components/BackgroundEffects'

export const metadata: Metadata = {
  title: 'Orishas in Salsa Dance | Salsa Rayo',
  description: 'Explore the sacred Orisha rhythms in Afro-Cuban salsa. Learn about the movements, specialties, and dance characteristics of each deity.',
  openGraph: {
    title: 'Orishas in Salsa Dance | Salsa Rayo',
    description: 'Explore the sacred Orisha rhythms in Afro-Cuban salsa. Learn about the movements, specialties, and dance characteristics of each deity.',
    type: 'website',
  },
}

export default function OrishasPage() {
  return (
    <main className="min-h-screen bg-base-100">
      <BackgroundEffects />
      <OrishasGrid />
    </main>
  )
}