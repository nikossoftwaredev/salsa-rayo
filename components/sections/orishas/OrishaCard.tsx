'use client'

import Image from 'next/image'
import { useLocale } from 'next-intl'
import { Orisha } from '@/data/orishas'
import { 
  FaBolt, FaDrum, FaExternalLinkAlt, FaHammer, 
  FaBullseye, FaDove, FaWind, FaHeart, FaWater, 
  FaCrutch, FaFire 
} from 'react-icons/fa'
import { GiCrossroad } from 'react-icons/gi'

interface OrishaCardProps {
  orisha: Orisha
}

export default function OrishaCard({ orisha }: OrishaCardProps) {
  const locale = useLocale() as 'en' | 'el' | 'es'
  
  const getOrishaIcon = (id: string) => {
    const iconProps = {
      className: "flex-shrink-0",
      style: { color: orisha.color },
      size: 16
    }
    
    switch(id) {
      case 'shango':
        return <FaBolt {...iconProps} />
      case 'eleggua':
        return <GiCrossroad {...iconProps} />
      case 'oggun':
        return <FaHammer {...iconProps} />
      case 'ochosi':
        return <FaBullseye {...iconProps} />
      case 'obatala':
        return <FaDove {...iconProps} />
      case 'oya':
        return <FaWind {...iconProps} />
      case 'oshun':
        return <FaHeart {...iconProps} />
      case 'yemaya':
        return <FaWater {...iconProps} />
      case 'babalu-aye':
        return <FaCrutch {...iconProps} />
      default:
        return <FaFire {...iconProps} />
    }
  }
  return (
    <div 
      className="card bg-base-100 shadow-2xl relative rounded-2xl transition-all duration-300 hover:scale-105"
      style={{
        '--hover-color': orisha.color
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 20px 60px ${orisha.color}40, 0 0 40px ${orisha.color}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Vertical image like Yu-Gi-Oh cards */}
      <figure className="relative h-80 overflow-hidden bg-gradient-to-b from-black/20 to-black/60 rounded-t-xl">
        <Image
          src={orisha.image}
          alt={orisha.name}
          width={400}
          height={600}
          className="object-cover object-top w-full h-full"
        />
        {/* Name overlay on image */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">
            {orisha.name}
          </h2>
        </div>
      </figure>
      
      <div className="card-body p-4">
        {/* Title with colored accent */}
        <div 
          className="text-sm font-bold opacity-90 mb-2 text-center"
          style={{ color: orisha.color }}
        >
          {orisha.title[locale] || orisha.title.en}
        </div>
        
        {/* Stats section with icons */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            {getOrishaIcon(orisha.id)}
            <p className="opacity-90 leading-tight">{orisha.specialty[locale] || orisha.specialty.en}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <FaDrum 
              className="flex-shrink-0" 
              style={{ color: orisha.color }} 
              size={16} 
            />
            <p className="opacity-90 leading-tight">{orisha.movements[locale] || orisha.movements.en}</p>
          </div>
        </div>
        
        {/* Bottom section with wiki link only */}
        <div className="flex justify-end mt-3 pt-2">
          <a
            href={orisha.wikiLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-xs btn-ghost gap-1 hover:text-primary"
          >
            <span>See More</span>
            <FaExternalLinkAlt size={10} />
          </a>
        </div>
      </div>
    </div>
  )
}