import { useEffect, useState } from 'react'
import { loadSurahIndex, type SurahInfo } from './data.ts'

function matches(s: SurahInfo, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    String(s.n) === q ||
    s.tr.toLowerCase().includes(q) ||
    s.en.toLowerCase().includes(q) ||
    s.ar.includes(query.trim())
  )
}

function SurahList() {
  const [surahs, setSurahs] = useState<SurahInfo[]>()
  const [error, setError] = useState<string>()
  const [query, setQuery] = useState('')

  useEffect(() => {
    loadSurahIndex()
      .then((index) => setSurahs(index.surahs))
      .catch((e: Error) => setError(e.message))
  }, [])

  const shown = surahs?.filter((s) => matches(s, query))

  return (
    <section>
      <h1>The Quran</h1>
      <input
        type="search"
        className="filter"
        placeholder="Find a surah by name or number"
        aria-label="Find a surah"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {error && <p className="error">{error}</p>}
      {!surahs && !error && <p className="muted">Loading…</p>}
      {shown?.length === 0 && <p className="muted">No surah matches “{query}”.</p>}

      <ol className="surah-list">
        {shown?.map((s) => (
          <li key={s.n}>
            <a href={`#/surah/${s.n}`}>
              <span className="surah-number">{s.n}</span>
              <span className="surah-names">
                <strong>{s.tr}</strong>
                <span className="muted">
                  {s.en} · {s.ayahs} ayahs · {s.type}
                </span>
              </span>
              <span className="surah-ar" lang="ar" dir="rtl">
                {s.ar}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default SurahList
