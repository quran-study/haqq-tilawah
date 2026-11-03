import { useCallback, useEffect, useMemo, useState } from 'react'
import AyahText from './AyahText.tsx'
import {
  ayahTokens,
  bismillahHeading,
  loadSurah,
  loadSurahIndex,
  loadWords,
  type Surah,
  type SurahIndex,
  type SurahWords,
  type Token,
} from './data.ts'
import { ARABIC_SIZES, useSettings } from './settings.ts'
import Translations from './Translations.tsx'
import WordPanel from './WordPanel.tsx'

type Props = {
  n: number
  ayah?: number
}

type Selection = { ayah: number; word: number }

// Maps each Corpus word (0-based) to the displayed token positions (1-based) it covers
function wordPositions(tokens: Token[], counts: number[]): number[][] {
  const wordTokens = tokens.flatMap((t, i) => (t.word ? [i + 1] : []))
  let next = 0
  return counts.map((count) => wordTokens.slice(next, (next += count)))
}

function Reader({ n, ayah }: Props) {
  const [index, setIndex] = useState<SurahIndex>()
  const [surah, setSurah] = useState<Surah>()
  const [words, setWords] = useState<SurahWords>()
  const [error, setError] = useState<string>()
  const [selection, setSelection] = useState<Selection>()
  const [settings, setSettings] = useSettings()

  useEffect(() => {
    Promise.all([loadSurahIndex(), loadSurah(n)])
      .then(([i, s]) => {
        setIndex(i)
        setSurah(s)
      })
      .catch((e: Error) => setError(e.message))
    // Word data is optional: the reader works without it, just without tappable words
    loadWords(n)
      .then(setWords)
      .catch(() => setWords(undefined))
  }, [n])

  useEffect(() => {
    if (surah && ayah) document.getElementById(`ayah-${ayah}`)?.scrollIntoView({ block: 'start' })
  }, [surah, ayah])

  const layout = useMemo(() => {
    if (!surah) return []
    return surah.ayahs.map((_, i) => {
      const tokens = ayahTokens(surah, i + 1)
      const positions = words ? wordPositions(tokens, words.ayahs[i].map((w) => w[0])) : []
      return { tokens, positions }
    })
  }, [surah, words])

  const closePanel = useCallback(() => setSelection(undefined), [])

  if (error) return <p className="error">{error}</p>
  if (!index || !surah) return <p className="muted">Loading…</p>

  const info = index.surahs[n - 1]
  const heading = bismillahHeading(surah)
  const sizeIndex = ARABIC_SIZES.indexOf(settings.arabicSize)

  const selected = selection && layout[selection.ayah - 1].positions[selection.word]
  const selectedWord = selection && words?.ayahs[selection.ayah - 1][selection.word]

  return (
    <article className="reader">
      <header className="reader-header">
        <p className="surah-ar-title" lang="ar" dir="rtl">
          {info.ar}
        </p>
        <h1>
          {info.n}. {info.tr}
        </h1>
        <p className="muted">
          {info.en} · {info.ayahs} ayahs · {info.type}
        </p>
      </header>

      <div className="reader-tools" role="group" aria-label="Reading options">
        <span className="translation-toggles">
          {index.translations.map((t) => (
            <label key={t.id}>
              <input
                type="checkbox"
                checked={settings.translations.includes(t.id)}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    translations: e.target.checked
                      ? index.translations.map((x) => x.id).filter((id) => id === t.id || settings.translations.includes(id))
                      : settings.translations.filter((id) => id !== t.id),
                  })
                }
              />{' '}
              {t.name}
            </label>
          ))}
        </span>
        <span className="size-buttons">
          <button
            type="button"
            aria-label="Smaller Arabic text"
            disabled={sizeIndex <= 0}
            onClick={() => setSettings({ ...settings, arabicSize: ARABIC_SIZES[sizeIndex - 1] })}
          >
            A−
          </button>
          <button
            type="button"
            aria-label="Larger Arabic text"
            disabled={sizeIndex >= ARABIC_SIZES.length - 1}
            onClick={() => setSettings({ ...settings, arabicSize: ARABIC_SIZES[sizeIndex + 1] })}
          >
            A+
          </button>
        </span>
      </div>

      {words && <p className="muted tap-hint">Tap any word to see its grammar, root and lemma.</p>}

      {heading && (
        <p className="bismillah" lang="ar" dir="rtl">
          {heading}
        </p>
      )}

      <ol className="ayahs">
        {surah.ayahs.map((row, i) => {
          const number = i + 1
          const { tokens, positions } = layout[i]
          const onWord = words
            ? (pos: number) => {
                const word = positions.findIndex((p) => p.includes(pos))
                if (word >= 0) setSelection({ ayah: number, word })
              }
            : undefined
          return (
            <li
              key={number}
              id={`ayah-${number}`}
              className={number === ayah ? 'ayah-row highlighted' : 'ayah-row'}
            >
              <AyahText
                tokens={tokens}
                ayah={number}
                onWord={onWord}
                selected={selection?.ayah === number && selected ? new Set(selected) : undefined}
                style={{ fontSize: `${settings.arabicSize}rem` }}
              />
              <Translations
                row={row}
                all={index.translations}
                shown={settings.translations}
                prefix={
                  <>
                    <a className="ayah-ref" href={`#/surah/${n}/${number}`}>
                      {n}:{number}
                    </a>{' '}
                  </>
                }
              />
            </li>
          )
        })}
      </ol>

      <nav className="reader-nav" aria-label="Surahs">
        {n > 1 ? <a href={`#/surah/${n - 1}`}>← {index.surahs[n - 2].tr}</a> : <span />}
        <a href="#/quran">All surahs</a>
        {n < 114 ? <a href={`#/surah/${n + 1}`}>{index.surahs[n].tr} →</a> : <span />}
      </nav>

      <p className="reader-credit">
        Arabic text: <a href="https://tanzil.net">Tanzil Project</a> (Uthmani, v1.1), unchanged.
        Translations: {index.translations.map((t) => t.name).join(' and ')} via Tanzil, for
        non-commercial use. Word grammar:{' '}
        <a href="https://corpus.quran.com">Quranic Arabic Corpus</a>.{' '}
        <a href="#/acknowledgements">Sources and terms</a>
      </p>

      {selection && selectedWord && selected && (
        <WordPanel
          key={`${selection.ayah}:${selection.word}`}
          surah={n}
          ayah={selection.ayah}
          index={selection.word + 1}
          word={selectedWord}
          text={selected.map((p) => layout[selection.ayah - 1].tokens[p - 1].text).join(' ')}
          onClose={closePanel}
        />
      )}
    </article>
  )
}

export default Reader
