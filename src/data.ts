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
  // [Arabic, English] per ayah, verbatim from Tanzil
  ayahs: [string, string][]
}

const dataUrl = (path: string) => `${import.meta.env.BASE_URL}data/${path}`

let indexPromise: Promise<SurahIndex> | undefined

export function loadSurahIndex(): Promise<SurahIndex> {
  indexPromise ??= fetch(dataUrl('surahs.json')).then((r) => {
    if (!r.ok) throw new Error(`Could not load the surah list (${r.status})`)
    return r.json()
  })
  return indexPromise
}

export async function loadSurah(n: number): Promise<Surah> {
  const r = await fetch(dataUrl(`surah/${n}.json`))
  if (!r.ok) throw new Error(`Could not load surah ${n} (${r.status})`)
  return r.json()
}

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

export function toArabicDigits(n: number): string {
  return String(n).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)])
}
