export type SurahInfo = {
  n: number
  ar: string
  tr: string
  en: string
  ayahs: number
  type: 'Meccan' | 'Medinan'
  order: number
}

export type Sources = {
  text: string
  translation: string
  morphology: string
  notice: string
}

export type SurahIndex = {
  sources: Sources
  // Al-Fatihah 1:1; Tanzil includes it at the start of ayah 1 of every surah except 1 and 9
  bismillah: string
  featured: { surah: number; ayah: number; ar: string; en: string }
  surahs: SurahInfo[]
}

export type Surah = {
  n: number
  sources: Sources
  // True when ayah 1 starts with the Bismillah (its first 4 words), shown as a heading
  bismillah: boolean
  // [Arabic, English] per ayah, verbatim from Tanzil
  ayahs: [string, string][]
}

// One Corpus segment: [Arabic form, part-of-speech tag, features]
export type Segment = [string, string, string]

// One word: [displayed tokens it covers, root, lemma, lemma id, segments]
export type Word = [number, string, string, string, Segment[]]

export type SurahWords = {
  n: number
  source: string
  ayahs: Word[][]
}

export type Lemma = {
  l: string
  k: string
  n: number
  // surah * 1,000,000 + ayah * 1,000 + displayed token position (1-based)
  locs: number[]
}

export type Root = {
  r: string
  b: string
  n: number
  lemmas: Lemma[]
}

const dataUrl = (path: string) => `${import.meta.env.BASE_URL}data/${path}`

function fetchJson<T>(path: string, what: string): Promise<T> {
  return fetch(dataUrl(path)).then((r) => {
    if (!r.ok) throw new Error(`Could not load ${what} (${r.status})`)
    return r.json() as Promise<T>
  })
}

// Each file is fetched once per visit; failures are forgotten so they can be retried
function cached<T>(load: (key: number) => Promise<T>) {
  const cache = new Map<number, Promise<T>>()
  return (key: number) => {
    if (!cache.has(key)) {
      cache.set(key, load(key).catch((e) => {
        cache.delete(key)
        throw e
      }))
    }
    return cache.get(key)!
  }
}

const once = <T,>(load: () => Promise<T>) => {
  const get = cached(() => load())
  return () => get(0)
}

export const loadSurahIndex = once(() => fetchJson<SurahIndex>('surahs.json', 'the surah list'))
export const loadSurah = cached((n) => fetchJson<Surah>(`surah/${n}.json`, `surah ${n}`))
export const loadWords = cached((n) => fetchJson<SurahWords>(`words/${n}.json`, `word data for surah ${n}`))
export const loadRoots = once(() =>
  fetchJson<{ source: string; roots: Root[] }>('roots.json', 'the roots').then((d) => d.roots),
)
type SearchFile = {
  source: string
  ayahs: string[]
  // By ayah position: each simple word's displayed word (0-based), where they differ
  wordMaps: Record<string, number[]>
  // Ayah positions whose words cannot be matched to the displayed text
  unaligned: number[]
}

// Tanzil's simple-clean text for searching
export const loadSearchText = once(() =>
  fetchJson<SearchFile>('search.json', 'the search text').then((d) => ({
    ayahs: d.ayahs,
    wordMaps: d.wordMaps,
    unaligned: new Set(d.unaligned),
  })),
)

export function decodeLocation(loc: number) {
  return {
    surah: Math.floor(loc / 1_000_000),
    ayah: Math.floor(loc / 1_000) % 1_000,
    token: loc % 1_000,
  }
}

// Pause marks and the sajdah sign are separate space-separated tokens in Tanzil's text
const MARKS = /^[\u06D6-\u06DC\u06DE\u06E9]+$/

export type Token = { text: string; word: boolean }

// The words of an ayah as displayed: the Bismillah heading is not part of ayah 1
export function ayahTokens(surah: Surah, ayah: number): Token[] {
  let words = surah.ayahs[ayah - 1][0].split(' ')
  if (ayah === 1 && surah.bismillah) words = words.slice(4)
  return words.map((text) => ({ text, word: !MARKS.test(text) }))
}

export function bismillahHeading(surah: Surah): string | undefined {
  return surah.bismillah ? surah.ayahs[0][0].split(' ').slice(0, 4).join(' ') : undefined
}

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

export function toArabicDigits(n: number): string {
  return String(n).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)])
}

// For matching typed Arabic: drops vowel marks and tatweel, and unifies alef, hamza and yeh forms
export function normaliseArabic(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')
    .replace(/\u0649/g, '\u064A')
}

export const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text)

// Lets people type a root with or without spaces, vowel marks or hamza forms
export const rootKey = (text: string) =>
  normaliseArabic(text).replace(/\s/g, '').replace(/[\u0621\u0624\u0626]/g, '\u0627')
