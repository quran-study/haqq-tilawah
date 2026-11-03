import { useEffect, useState } from 'react'
import {
  isArabic,
  loadRoots,
  loadSearchText,
  loadSurah,
  loadSurahIndex,
  normaliseArabic,
  rootKey,
  type Root,
} from './data.ts'
import { spacedRoot } from './grammar.ts'
import Occurrences from './Occurrences.tsx'

type Props = {
  query: string
}

type Results = {
  locs: number[]
  ayahCount: number
  englishMatch?: RegExp
  roots: Root[]
}

const loc = (surah: number, ayah: number, token: number) => surah * 1_000_000 + ayah * 1_000 + token

// Every ayah as [surah, ayah], in order
async function ayahList(): Promise<[number, number][]> {
  const index = await loadSurahIndex()
  return index.surahs.flatMap((s) => Array.from({ length: s.ayahs }, (_, i) => [s.n, i + 1] as [number, number]))
}

// Arabic: matches Tanzil's simple-clean text, then highlights the matching words in the
// displayed text (see build-data for how the two texts' words are matched)
async function searchArabic(query: string): Promise<Results> {
  const [{ ayahs: text, wordMaps, unaligned }, ayahs, roots] = await Promise.all([
    loadSearchText(),
    ayahList(),
    loadRoots(),
  ])
  const q = normaliseArabic(query.trim())
  const locs: number[] = []
  let ayahCount = 0
  text.forEach((ayahText, i) => {
    const words = ayahText.split(' ').map(normaliseArabic)
    const joined = words.join(' ')
    if (!joined.includes(q)) return
    ayahCount++
    const [s, a] = ayahs[i]
    if (unaligned.has(i)) {
      locs.push(loc(s, a, 0))
      return
    }
    // Highlight each word that overlaps a match
    const starts = words.map((_, j) => words.slice(0, j).join(' ').length + (j > 0 ? 1 : 0))
    const hits = new Set<number>()
    for (let at = joined.indexOf(q); at >= 0; at = joined.indexOf(q, at + 1)) {
      words.forEach((w, j) => {
        if (starts[j] < at + q.length && starts[j] + w.length > at) hits.add(j)
      })
    }
    const map = wordMaps[i]
    for (const j of new Set([...hits].map((j) => (map ? map[j] : j)))) locs.push(loc(s, a, j + 1))
  })
  const key = rootKey(query)
  const matchingRoots = key.length >= 2 && key.length <= 4 ? roots.filter((r) => rootKey(r.r) === key) : []
  return { locs, ayahCount, roots: matchingRoots }
}

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

async function searchEnglish(query: string): Promise<Results> {
  const index = await loadSurahIndex()
  const surahs = await Promise.all(index.surahs.map((s) => loadSurah(s.n)))
  const pattern = new RegExp(`\\b(${escapeRegExp(query.trim())})`, 'i')
  const locs: number[] = []
  for (const s of surahs) {
    s.ayahs.forEach(([, en], i) => {
      if (pattern.test(en)) locs.push(loc(s.n, i + 1, 0))
    })
  }
  return { locs, ayahCount: locs.length, englishMatch: new RegExp(pattern.source, 'gi'), roots: [] }
}

function Search({ query }: Props) {
  const [input, setInput] = useState(query)
  const [results, setResults] = useState<Results & { query: string }>()
  const [error, setError] = useState<string>()
  const arabic = isArabic(query)

  useEffect(() => {
    if (!query.trim()) return
    ;(arabic ? searchArabic(query) : searchEnglish(query))
      .then((r) => setResults({ ...r, query }))
      .catch((e: Error) => setError(e.message))
  }, [query, arabic])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) window.location.hash = `#/search/${encodeURIComponent(input.trim())}`
  }

  const current = results?.query === query ? results : undefined

  return (
    <section>
      <h1>Search</h1>
      <form className="search-form" onSubmit={submit} role="search">
        <input
          type="search"
          className="filter"
          placeholder="Search in Arabic or English, e.g. رحمة or mercy"
          aria-label="Search the Quran"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          dir="auto"
        />
        <button type="submit" className="button">
          Search
        </button>
      </form>
      <p className="muted search-help">
        Arabic searches the Quran text (vowel marks are optional). English searches the Saheeh
        International translation. To search by root, use <a href="#/roots">Roots</a>.
      </p>

      {error && <p className="error">{error}</p>}
      {query.trim() && !current && !error && <p className="muted">Searching…</p>}

      {current && (
        <>
          {current.roots.length > 0 && (
            <p className="root-suggestion">
              Looking for the root?{' '}
              {current.roots.map((r) => (
                <a key={r.r} href={`#/root/${encodeURIComponent(r.r)}`} lang="ar" dir="rtl" className="root-link">
                  {spacedRoot(r.r)}
                </a>
              ))}{' '}
              <span className="muted">covers every word formed from it</span>
            </p>
          )}
          <p>
            <strong>{current.ayahCount}</strong> {current.ayahCount === 1 ? 'ayah' : 'ayahs'} found for “
            {current.query}”
          </p>
          <Occurrences
            key={current.query}
            locs={current.locs}
            byWord
            englishMatch={current.englishMatch}
          />
        </>
      )}
    </section>
  )
}

export default Search
