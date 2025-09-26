type MultilingualText = { en: string; el: string; es?: string }

export interface Orisha {
  id: string
  name: string
  title: MultilingualText
  specialty: MultilingualText
  rhythm: MultilingualText
  movements: MultilingualText
  color: string
  image: string
  wikiLink: string
}

export const orishas: Orisha[] = [
  {
    id: 'shango',
    name: 'Shangó ⚡',
    title: { en: 'God of Thunder (Rayo)', el: 'Θεός του Κεραυνού (Rayo)', es: 'Dios del Trueno (Rayo)' },
    specialty: { en: 'Thunder, lightning, fire, justice, drums', el: 'Κεραυνός, αστραπή, φωτιά, δικαιοσύνη, τύμπανα' },
    rhythm: { en: 'Toque de Shangó', el: 'Toque de Shangó' },
    movements: { en: 'Powerful axe throwing motions, lightning strikes, chest-proud warrior stance', el: 'Δυναμικές κινήσεις ρίψης τσεκουριού, χτυπήματα κεραυνού, περήφανη πολεμική στάση' },
    color: '#FFC107',
    image: '/images/orishas/shango.jpg',
    wikiLink: 'https://en.wikipedia.org/wiki/Shango'
  },
  {
    id: 'eleggua',
    name: 'Elegguá',
    title: { en: 'Guardian of Crossroads', el: 'Φύλακας των Μονοπατιών', es: 'Guardián de las Encrucijadas' },
    specialty: { en: 'Opener of paths, destiny', el: 'Ανοίγει δρόμους, πεπρωμένο' },
    rhythm: { en: 'Toque de Elegguá', el: 'Toque de Elegguá' },
    movements: { en: 'Playful, mischievous, childlike gestures with spinning and quick direction changes', el: 'Παιχνιδιάρικες, πονηρές, παιδικές κινήσεις με περιστροφές και γρήγορες αλλαγές κατεύθυνσης' },
    color: '#DC2626',
    image: '/images/orishas/eleggua.jpg',
    wikiLink: 'https://en.wikipedia.org/wiki/Elegua'
  },
  {
    id: 'oggun',
    name: 'Oggún',
    title: { en: 'God of Iron', el: 'Θεός του Σιδήρου', es: 'Dios del Hierro' },
    specialty: { en: 'War, iron, labor', el: 'Πόλεμος, σίδηρος, εργασία' },
    rhythm: { en: 'Toque de Oggún', el: 'Toque de Oggún' },
    movements: { en: 'Strong warrior-like stances, machete cutting motions, forceful and grounded', el: 'Ισχυρές πολεμικές στάσεις, κινήσεις κοψίματος με μαχαίρι, δυνατές και γερά γειωμένες' },
    color: '#16A34A',
    image: '/images/orishas/oggun.jpg',
    wikiLink: 'https://en.wikipedia.org/wiki/Ogun'
  },
  {
    id: 'ochosi',
    name: 'Ochosi',
    title: { en: 'Divine Hunter', el: 'Θεός του Κυνηγιού', es: 'Cazador Divino' },
    specialty: { en: 'Hunt, justice, precision', el: 'Κυνήγι, δικαιοσύνη, ακρίβεια' },
    rhythm: { en: 'Toque de Ochosi', el: 'Toque de Ochosi' },
    movements: { en: 'Bow and arrow aiming gestures, precise tracking steps, focused hunter stances', el: 'Κινήσεις στόχευσης με τόξο και βέλος, ακριβή βήματα ιχνηλάτησης, εστιασμένες στάσεις κυνηγού' },
    color: '#2563EB',
    image: '/images/orishas/ochosi.jpg',
    wikiLink: 'https://en.wikipedia.org/wiki/Ochosi'
  },
  {
    id: 'obatala',
    name: 'Obatalá',
    title: { en: 'Father of Wisdom', el: 'Πατέρας της Σοφίας', es: 'Padre de la Sabiduría' },
    specialty: { en: 'Peace, purity, wisdom, creation', el: 'Ειρήνη, αγνότητα, σοφία, δημιουργία' },
    rhythm: { en: 'Toque de Obatalá', el: 'Toque de Obatalá' },
    movements: { en: 'Slow dignified steps, elderly grace, movements with white cloth representing purity', el: 'Αργά αξιοπρεπή βήματα, γεροντική χάρη, κινήσεις με λευκό ύφασμα που συμβολίζει την αγνότητα' },
    color: '#9CA3AF',
    image: '/images/orishas/obatala.jpg',
    wikiLink: 'https://en.wikipedia.org/wiki/Obatala'
  },
  {
    id: 'oya',
    name: 'Oyá',
    title: { en: 'Goddess of Winds', el: 'Θεά των Ανέμων', es: 'Diosa de los Vientos' },
    specialty: { en: 'Winds, storms, transformation', el: 'Άνεμοι, καταιγίδες, μεταμόρφωση' },
    rhythm: { en: 'Toque de Oyá', el: 'Toque de Oyá' },
    movements: { en: 'Whirling windstorm spins, flowing fabric to represent winds and lightning', el: 'Στροβιλιζόμενες περιστροφές σαν ανεμοστρόβιλος, κυματιστό ύφασμα που αναπαριστά ανέμους και αστραπές' },
    color: '#8B5CF6',
    image: '/images/orishas/oya.jpg',
    wikiLink: 'https://en.wikipedia.org/wiki/Oya'
  },
  {
    id: 'oshun',
    name: 'Oshún',
    title: { en: 'River Goddess of Love', el: 'Θεά του Ποταμού της Αγάπης', es: 'Diosa del Río del Amor' },
    specialty: { en: 'Love, beauty, rivers, honey', el: 'Αγάπη, ομορφιά, ποτάμια, μέλι' },
    rhythm: { en: 'Toque de Oshún', el: 'Toque de Oshún' },
    movements: { en: 'Sensual hip movements, mirror gazing gestures, sweet honey-like flows', el: 'Αισθησιακές κινήσεις λεκάνης, κινήσεις καθρεφτίσματος, γλυκές ρευστές κινήσεις σαν μέλι' },
    color: '#F59E0B',
    image: '/images/orishas/oshun.jpg',
    wikiLink: 'https://en.wikipedia.org/wiki/Oshun'
  },
  {
    id: 'yemaya',
    name: 'Yemayá',
    title: { en: 'Mother of the Sea', el: 'Μητέρα της Θάλασσας', es: 'Madre del Mar' },
    specialty: { en: 'Ocean, motherhood, protection', el: 'Ωκεανός, μητρότητα, προστασία' },
    rhythm: { en: 'Toque de Yemayá', el: 'Toque de Yemayá' },
    movements: { en: 'Flowing ocean waves with arms, maternal embraces, undulating like the sea', el: 'Κυματιστές κινήσεις με τα χέρια σαν θαλάσσια κύματα, μητρικές αγκαλιές, κυλιόμενες κινήσεις σαν θάλασσα' },
    color: '#0EA5E9',
    image: '/images/orishas/yemaya.jpg',
    wikiLink: 'https://en.wikipedia.org/wiki/Yemoja'
  },
  {
    id: 'babalu-aye',
    name: 'Babalú-Ayé',
    title: { en: 'Healer of Ailments', el: 'Θεραπευτής των Ασθενειών', es: 'Sanador de Dolencias' },
    specialty: { en: 'Disease, healing, earth, dogs', el: 'Ασθένεια, θεραπεία, γη, σκύλοι' },
    rhythm: { en: 'Toque de Babalú', el: 'Toque de Babalú' },
    movements: { en: 'Limping with cane or crutches, humble bent posture, sweeping cleansing gestures', el: 'Κουτσό βάδισμα με μπαστούνι ή πατερίτσες, ταπεινή σκυμμένη στάση, σαρωτικές κινήσεις καθαρμού' },
    color: '#7C3AED',
    image: '/images/orishas/babalu-aye.jpg',
    wikiLink: 'https://en.wikipedia.org/wiki/Babalu_Aye'
  }
]