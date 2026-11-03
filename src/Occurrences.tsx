import { useEffect, useState } from 'react'
import AyahText from './AyahText.tsx'
import { ayahTokens, decodeLocation, loadSurah, type Surah } from './data.ts'

const PAGE = 20

type Props = {
  // Encoded word locations (see decodeLocation); several may share an ayah.
  // A token position of 0 marks the ayah without highlighting a word.
  locs: number[]
  // When true, token positions count words only (pause marks skipped)
  byWord?: boolean
  // Highlights matching text in the translation
  englishMatch?: RegExp
}

function highlightEnglish(text: string, match?: RegExp) {
  if (!match) return text
  return text.split(match).map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part))
}

// Ayahs containing the given words, with those words highlighted
function Occurrences({ locs, byWord, englishMatch }: Props) {
  const [shown, setShown] = useState(PAGE)
  const [surahs, setSurahs] = useState<Map<number, Surah>>(new Map())

  // Group word positions by ayah, keeping Quran order
  const ayahs = new Map<string, { surah: number; ayah: number; tokens: Set<number> }>()
  for (const loc of locs) {
    const { surah, ayah, token } = decodeLocation(loc)
    const key = `${surah}:${ayah}`
    if (!ayahs.has(key)) ayahs.set(key, { surah, ayah, tokens: new Set() })
    ayahs.get(key)!.tokens.add(token)
  }
  const list = [...ayahs.values()]
  const visible = list.slice(0, shown)
  const needed = [...new Set(visible.map((a) => a.surah))].filter((s) => !surahs.has(s)).join(',')

  useEffect(() => {
    if (!needed) return
    Promise.all(needed.split(',').map((s) => loadSurah(Number(s))))
      .then((loaded) =>
        setSurahs((prev) => {
          const next = new Map(prev)
          for (const s of loaded) next.set(s.n, s)
          return next
        }),
      )
      .catch(() => undefined)
  }, [needed])

  return (
    <>
      <ol className="occurrences">
        {visible.map(({ surah, ayah, tokens }) => {
          const s = surahs.get(surah)
          const ayahText = s && ayahTokens(s, ayah)
          let highlight = tokens
          if (ayahText && byWord) {
            const wordPositions = ayahText.flatMap((t, i) => (t.word ? [i + 1] : []))
            highlight = new Set([...tokens].filter((w) => w > 0).map((w) => wordPositions[w - 1]))
          }
          return (
            <li key={`${surah}:${ayah}`}>
              <a className="ayah-ref" href={`#/surah/${surah}/${ayah}`}>
                {surah}:{ayah}
              </a>
              {s && ayahText ? (
                <>
                  <AyahText tokens={ayahText} ayah={ayah} highlight={highlight} />
                  <p className="ayah-en">{highlightEnglish(s.ayahs[ayah - 1][1], englishMatch)}</p>
                </>
              ) : (
                <p className="muted">Loading…</p>
              )}
            </li>
          )
        })}
      </ol>
      {shown < list.length && (
        <button type="button" className="more" onClick={() => setShown(shown + PAGE)}>
          Show more ({list.length - shown} more {list.length - shown === 1 ? 'ayah' : 'ayahs'})
        </button>
      )}
    </>
  )
}

export default Occurrences
