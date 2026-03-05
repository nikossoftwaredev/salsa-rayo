const GREEK_TO_LATIN: Record<string, string> = {
  α: "a", β: "b", γ: "g", δ: "d", ε: "e", ζ: "z", η: "i", θ: "th",
  ι: "i", κ: "k", λ: "l", μ: "m", ν: "n", ξ: "x", ο: "o", π: "p",
  ρ: "r", σ: "s", ς: "s", τ: "t", υ: "y", φ: "f", χ: "ch", ψ: "ps", ω: "o",
}

const stripAccents = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

const toGreeklish = (str: string) =>
  stripAccents(str)
    .split("")
    .map((ch) => GREEK_TO_LATIN[ch] ?? ch)
    .join("")

export const normalizeForSearch = (str: string) =>
  stripAccents(str).toLowerCase()

export const matchesSearch = (text: string, query: string) => {
  const q = normalizeForSearch(query)
  if (!q) return true
  const normalized = normalizeForSearch(text)
  if (normalized.includes(q)) return true
  const greeklish = toGreeklish(text).toLowerCase()
  return greeklish.includes(q)
}
