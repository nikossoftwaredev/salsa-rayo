// Co-founders lead the team section, in this order. Instructors are free-text
// names typed in the admin panel, so match on the first name in either script,
// ignoring case and accents ("Άννα Λόντου" and "anna" both match). The key
// doubles as the prefix of the founder's localized title in the About messages
// (annaTitle, konstantinosTitle).
const FOUNDERS = [
  { key: "anna", aliases: ["anna", "αννα"] },
  { key: "konstantinos", aliases: ["konstantinos", "κωνσταντινος"] },
] as const

export type FounderKey = (typeof FOUNDERS)[number]["key"]

const normalize = (value: string) =>
  value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim()

const getFounderRank = (name: string) => {
  const firstName = normalize(name).split(/\s+/)[0] ?? ""
  const rank = FOUNDERS.findIndex(({ aliases }) =>
    (aliases as readonly string[]).includes(firstName)
  )
  return rank === -1 ? FOUNDERS.length : rank
}

export const getFounderKey = (name: string): FounderKey | null =>
  FOUNDERS[getFounderRank(name)]?.key ?? null

/** Founders first in FOUNDERS order; everyone else keeps their incoming order. */
export const sortFoundersFirst = <T extends { name: string }>(members: T[]) =>
  [...members].sort((a, b) => getFounderRank(a.name) - getFounderRank(b.name))
