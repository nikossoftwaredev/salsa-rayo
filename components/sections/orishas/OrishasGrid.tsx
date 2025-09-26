'use client'

import { orishas } from '@/data/orishas'
import OrishaCard from './OrishaCard'

export default function OrishasGrid() {
  return (
    <section className="py-20 px-4 bg-gray-900 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Orishas in Salsa Dance
            </span>
          </h1>
          <p className="text-xl text-gray-200 mb-2">Discover the Sacred Rhythms</p>
          <p className="max-w-3xl mx-auto text-base text-gray-300 mt-6">
            In salsa, the Afro element is deeply incorporated through Orisha movements 
            from Yoruba traditions. Each deity brings specific rhythms and dance characteristics,
            connecting spiritual expression with vibrant salsa energy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orishas.map((orisha) => (
            <OrishaCard key={orisha.id} orisha={orisha} />
          ))}
        </div>

        <div className="text-center mt-16 p-8 bg-gray-800 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-100">Experience the Sacred Dance</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            In our salsa classes, we honor these traditions by incorporating Orisha-inspired 
            movements, helping you connect with the deeper cultural roots of Afro-Cuban dance 
            while mastering the rhythms that move both body and spirit.
          </p>
        </div>
      </div>
    </section>
  )
}