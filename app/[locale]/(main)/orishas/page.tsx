import { Metadata } from 'next'
import OrishasGrid from '@/components/sections/orishas/OrishasGrid'
import BackgroundEffects from '@/components/BackgroundEffects'
import { BasePageProps } from '@/types/pageprops'
import JsonLd from '@/components/JsonLd'
import { getBreadcrumbSchema, getOrishasArticleSchema } from '@/lib/schema'

export const generateMetadata = async ({ params }: BasePageProps): Promise<Metadata> => {
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
    alternates: {
      canonical: `https://www.salsarayo.com/${locale}/orishas`,
      languages: {
        en: "https://www.salsarayo.com/en/orishas",
        el: "https://www.salsarayo.com/el/orishas",
        es: "https://www.salsarayo.com/es/orishas",
        "x-default": "https://www.salsarayo.com/en/orishas",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://www.salsarayo.com/${locale}/orishas`,
      type: 'website',
    },
  }
}

const OrishasPage = async ({ params }: BasePageProps) => {
  const locale = (await params).locale

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: "Home", url: `https://www.salsarayo.com/${locale}` },
            { name: "Orishas", url: `https://www.salsarayo.com/${locale}/orishas` },
          ]),
          getOrishasArticleSchema(locale),
        ]}
      />
      <BackgroundEffects />
      <OrishasGrid />
    </main>
  )
}

export default OrishasPage
