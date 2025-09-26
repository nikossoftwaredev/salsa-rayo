export interface Orisha {
  id: string
  name: string
  title: string
  specialty: string
  rhythm: string
  movements: string
  color: string
  image: string
  wikiLink: string
}

export const orishas: Orisha[] = [
  {
    id: 'shango',
    name: 'Shangó ⚡',
    title: 'Thunder King - God of Thunder (Rayo)',
    specialty: 'Thunder, lightning, fire, justice, drums',
    rhythm: 'Toque de Shangó',
    movements: 'Powerful axe throwing motions, lightning strikes, chest-proud warrior stance',
    color: '#FFC107',
    image: '/images/orishas/shango.jpg',
    wikiLink: 'https://en.wikipedia.org/wiki/Shango'
  },
  {
    id: 'eleggua',
    name: 'Elegguá',
    title: 'Guardian of Crossroads',
    specialty: 'Opener of paths, destiny',
    rhythm: 'Toque de Elegguá',
    movements: 'Playful, mischievous, childlike gestures with spinning and quick direction changes',
    color: '#DC2626',
    image: '/images/orishas/eleggua.jpg',
    wikiLink: 'https://en.wikipedia.org/wiki/Elegua'
  },
  {
    id: 'oggun',
    name: 'Oggún',
    title: 'Warrior of Iron',
    specialty: 'War, iron, labor',
    rhythm: 'Toque de Oggún',
    movements: 'Strong warrior-like stances, machete cutting motions, forceful and grounded',
    color: '#16A34A',
    image: '/images/orishas/oggun.jpg',
    wikiLink: 'https://en.wikipedia.org/wiki/Ogun'
  },
  {
    id: 'ochosi',
    name: 'Ochosi',
    title: 'Divine Hunter',
    specialty: 'Hunt, justice, precision',
    rhythm: 'Toque de Ochosi',
    movements: 'Bow and arrow aiming gestures, precise tracking steps, focused hunter stances',
    color: '#2563EB',
    image: '/images/orishas/ochosi.jpg',
    wikiLink: 'https://en.wikipedia.org/wiki/Ochosi'
  },
  {
    id: 'obatala',
    name: 'Obatalá',
    title: 'Father of Wisdom',
    specialty: 'Peace, purity, wisdom, creation',
    rhythm: 'Toque de Obatalá',
    movements: 'Slow dignified steps, elderly grace, movements with white cloth representing purity',
    color: '#9CA3AF',
    image: '/images/orishas/obatala.jpg',
    wikiLink: 'https://en.wikipedia.org/wiki/Obatala'
  },
  {
    id: 'oya',
    name: 'Oyá',
    title: 'Warrior of Winds',
    specialty: 'Winds, storms, transformation',
    rhythm: 'Toque de Oyá',
    movements: 'Whirling windstorm spins, flowing fabric to represent winds and lightning',
    color: '#8B5CF6',
    image: '/images/orishas/oya.jpg',
    wikiLink: 'https://en.wikipedia.org/wiki/Oya'
  },
  {
    id: 'oshun',
    name: 'Oshún',
    title: 'River Goddess of Love',
    specialty: 'Love, beauty, rivers, honey',
    rhythm: 'Toque de Oshún',
    movements: 'Sensual hip movements, mirror gazing gestures, sweet honey-like flows',
    color: '#F59E0B',
    image: '/images/orishas/oshun.jpg',
    wikiLink: 'https://en.wikipedia.org/wiki/Oshun'
  },
  {
    id: 'yemaya',
    name: 'Yemayá',
    title: 'Mother of the Sea',
    specialty: 'Ocean, motherhood, protection',
    rhythm: 'Toque de Yemayá',
    movements: 'Flowing ocean waves with arms, maternal embraces, undulating like the sea',
    color: '#0EA5E9',
    image: '/images/orishas/yemaya.jpg',
    wikiLink: 'https://en.wikipedia.org/wiki/Yemoja'
  },
  {
    id: 'babalu-aye',
    name: 'Babalú-Ayé',
    title: 'Healer of Ailments',
    specialty: 'Disease, healing, earth, dogs',
    rhythm: 'Toque de Babalú',
    movements: 'Limping with cane or crutches, humble bent posture, sweeping cleansing gestures',
    color: '#7C3AED',
    image: '/images/orishas/babalu-aye.jpg',
    wikiLink: 'https://en.wikipedia.org/wiki/Babalu_Aye'
  }
]