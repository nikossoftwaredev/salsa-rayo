import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import OrishasGrid from '@/components/sections/orishas/OrishasGrid'
import BackgroundEffects from '@/components/BackgroundEffects'
import { BasePageProps } from '@/types/pageprops'
import JsonLd from '@/components/JsonLd'
import {
  getBreadcrumbSchema,
  getOrishasArticleSchema,
  getFAQPageSchema,
} from '@/lib/schema'
import { SUPPORTED_LOCALES } from '@/i18n/routing'

export const revalidate = 3600

export const generateMetadata = async ({ params }: BasePageProps): Promise<Metadata> => {
  const locale = (await params).locale

  const titles = {
    en: 'Orisha Dance Rhythms in Salsa: 7 Yoruba Deities Guide',
    el: 'Οι 7 Orishas στην Salsa: Ιεροί Χοροί των Γιορούμπα',
    es: 'Los 7 Orishas en la Salsa: Guía de Ritmos Yoruba'
  }

  const descriptions = {
    en: 'Discover the 7 sacred Orisha rhythms of Afro-Cuban salsa - Yemayá, Changó, Oyá and more. Each Yoruba deity\'s signature dance movements, music, and meaning explained.',
    el: 'Ανακαλύψτε τους 7 ιερούς ρυθμούς των Orishas στην Afro-Cuban salsa - Yemayá, Changó, Oyá και άλλους. Οι κινήσεις, η μουσική και η σημασία κάθε θεότητας Γιορούμπα.',
    es: 'Descubre los 7 ritmos sagrados de los Orishas en la salsa afrocubana - Yemayá, Changó, Oyá y más. Movimientos, música y significado de cada deidad Yoruba.'
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

const FAQ_KEY_PAIRS = [
  ['faq.q1', 'faq.a1'],
  ['faq.q2', 'faq.a2'],
  ['faq.q3', 'faq.a3'],
  ['faq.q4', 'faq.a4'],
  ['faq.q5', 'faq.a5'],
] as const

const OrishasPage = async ({ params }: BasePageProps) => {
  const locale = (await params).locale as (typeof SUPPORTED_LOCALES)[number]
  const t = await getTranslations({ locale, namespace: 'Orishas' })

  const faqItems = FAQ_KEY_PAIRS.map(([qKey, aKey]) => ({
    question: t(qKey),
    answer: t(aKey),
  }))

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: "Home", url: `https://www.salsarayo.com/${locale}` },
            { name: "Orishas", url: `https://www.salsarayo.com/${locale}/orishas` },
          ]),
          getOrishasArticleSchema(locale),
          getFAQPageSchema(faqItems),
        ]}
      />
      <BackgroundEffects />
      <OrishasGrid />
    </main>
  )
}

export default OrishasPage
