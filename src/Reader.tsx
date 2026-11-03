import { useEffect, useState } from 'react'
import {
  loadSurah,
  loadSurahIndex,
  toArabicDigits,
  type Surah,
  type SurahIndex,
} from './data.ts'
import { ARABIC_SIZES, useSettings } from './settings.ts'

type Props = {
  n: number
  ayah?: number
}

// Shows the Bismillah that Tanzil places at the start of ayah 1 as a heading,
// as printed mushafs do. No words are dropped: ayah 1 shows the remainder.
function splitBismillah(index: SurahIndex, surah: Surah) {
  const first = surah.ayahs[0][0]
  const prefix = `${index.bismillah} `
  if (surah.n === 1 || !first.startsWith(prefix)) return { heading: undefined, firstAyah: first }
  return { heading: index.bismillah, firstAyah: first.slice(prefix.length) }
}

function Reader({ n, ayah }: Props) {
  const [index, setIndex] = useState<SurahIndex>()
  const [surah, setSurah] = useState<Surah>()
  const [error, setError] = useState<string>()
  const [settings, setSettings] = useSettings()

  useEffect(() => {
    Promise.all([loadSurahIndex(), loadSurah(n)])
      .then(([i, s]) => {
        setIndex(i)
        setSurah(s)
      })
      .catch((e: Error) => setError(e.message))
  }, [n])

  useEffect(() => {
    if (surah && ayah) document.getElementById(`ayah-${ayah}`)?.scrollIntoView({ block: 'start' })
  }, [surah, ayah])

  if (error) return <p className="error">{error}</p>
  if (!index || !surah) return <p className="muted">Loading…</p>

  const info = index.surahs[n - 1]
  const { heading, firstAyah } = splitBismillah(index, surah)
  const sizeIndex = ARABIC_SIZES.indexOf(settings.arabicSize)

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
        <label>
          <input
            type="checkbox"
            checked={settings.showTranslation}
            onChange={(e) => setSettings({ ...settings, showTranslation: e.target.checked })}
          />{' '}
          Translation
        </label>
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

      {heading && (
        <p className="bismillah" lang="ar" dir="rtl">
          {heading}
        </p>
      )}

      <ol className="ayahs">
        {surah.ayahs.map(([ar, en], i) => {
          const number = i + 1
          return (
            <li
              key={number}
              id={`ayah-${number}`}
              className={number === ayah ? 'ayah-row highlighted' : 'ayah-row'}
            >
              <p
                className="ayah-ar"
                lang="ar"
                dir="rtl"
                style={{ fontSize: `${settings.arabicSize}rem` }}
              >
                {i === 0 ? firstAyah : ar}{' '}
                <span className="ayah-end" aria-label={`Ayah ${number}`}>
                  {'۝'}
                  {toArabicDigits(number)}
                </span>
              </p>
              {settings.showTranslation && (
                <p className="ayah-en">
                  <a className="ayah-ref" href={`#/surah/${n}/${number}`}>
                    {n}:{number}
                  </a>{' '}
                  {en}
                </p>
              )}
            </li>
          )
        })}
      </ol>

      <nav className="reader-nav" aria-label="Surahs">
        {n > 1 ? (
          <a href={`#/surah/${n - 1}`}>← {index.surahs[n - 2].tr}</a>
        ) : (
          <span />
        )}
        <a href="#/quran">All surahs</a>
        {n < 114 ? <a href={`#/surah/${n + 1}`}>{index.surahs[n].tr} →</a> : <span />}
      </nav>

      <p className="reader-credit">
        Arabic text: <a href="https://tanzil.net">Tanzil Project</a> (Uthmani, v1.1), unchanged.
        Translation: Saheeh International via Tanzil, for non-commercial use.{' '}
        <a href="#/acknowledgements">Sources and terms</a>
      </p>
    </article>
  )
}

export default Reader
