import { Metadata } from 'next'
import OrishasGrid from '@/components/sections/orishas/OrishasGrid'
import BackgroundEffects from '@/components/BackgroundEffects'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale
  
  const titles = {
    en: 'Orishas in Salsa Dance | Salsa Rayo',
    el: 'Οι Orishas στην Salsa | Salsa Rayo',
    es: 'Los Orishas en la Salsa | Salsa Rayo'
  }
  
  const descriptions = {
    en: 'Explore the sacred Orisha rhythms in Afro-Cuban salsa. Learn about the movements, specialties, and dance characteristics of each deity.',
    el: 'Εξερευνήστε τους ιερούς ρυθμούς των Orishas στην Afro-Cuban salsa. Μάθετε για τις κινήσεις, τις ειδικότητες και τα χορευτικά χαρακτηριστικά κάθε θεότητας.',
    es: 'Explora los ritmos sagrados de los Orishas en la salsa afrocubana. Aprende sobre los movimientos, especialidades y características de baile de cada deidad.'
  }
  
  const title = titles[locale as keyof typeof titles] || titles.en
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.en
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}

export default function OrishasPage() {
  return (
    <main className="min-h-screen bg-background">
      <BackgroundEffects />
      <OrishasGrid />
    </main>
  )
}