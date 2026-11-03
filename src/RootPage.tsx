import { useEffect, useState } from 'react'
import { loadRoots, type Root } from './data.ts'
import { spacedRoot } from './grammar.ts'
import Occurrences from './Occurrences.tsx'

type Props = {
  root: string
}

function RootPage({ root }: Props) {
  const [info, setInfo] = useState<Root | null>()
  const [error, setError] = useState<string>()
  const [open, setOpen] = useState<string>()

  useEffect(() => {
    loadRoots()
      .then((roots) => {
        const found = roots.find((r) => r.r === root) ?? null
        setInfo(found)
        if (found) setOpen(found.lemmas[0].k)
      })
      .catch((e: Error) => setError(e.message))
  }, [root])

  if (error) return <p className="error">{error}</p>
  if (info === undefined) return <p className="muted">Loading…</p>
  if (info === null)
    return (
      <section>
        <h1>Root not found</h1>
        <p>
          There is no root “{root}” in the data. <a href="#/roots">Browse all roots</a>
        </p>
      </section>
    )

  const ayahCount = new Set(info.lemmas.flatMap((l) => l.locs.map((loc) => Math.floor(loc / 1000)))).size

  return (
    <section>
      <p className="breadcrumb">
        <a href="#/roots">Roots</a>
      </p>
      <header className="root-header">
        <p className="root-title" lang="ar" dir="rtl">
          {spacedRoot(info.r)}
        </p>
        <p className="muted">
          Appears {info.n} times in {ayahCount} ayahs, in {info.lemmas.length}{' '}
          {info.lemmas.length === 1 ? 'form' : 'forms'}
        </p>
      </header>

      <h2>Forms of this root</h2>
      <p className="muted">
        Each form (lemma) is a distinct word built from the root. Choose one to see every ayah where
        it appears.
      </p>
      <ul className="lemma-list">
        {info.lemmas.map((l) => (
          <li key={l.k}>
            <button
              type="button"
              aria-expanded={open === l.k}
              className={open === l.k ? 'lemma-button open' : 'lemma-button'}
              onClick={() => setOpen(open === l.k ? undefined : l.k)}
            >
              <span lang="ar" dir="rtl" className="lemma">
                {l.l}
              </span>
              <span className="muted">{l.n}×</span>
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <>
          <h2>
            Where{' '}
            <span lang="ar" dir="rtl" className="lemma">
              {info.lemmas.find((l) => l.k === open)!.l}
            </span>{' '}
            appears
          </h2>
          <Occurrences key={open} locs={info.lemmas.find((l) => l.k === open)!.locs} />
        </>
      )}

      <p className="reader-credit">
        Roots and lemmas from the <a href="https://corpus.quran.com">Quranic Arabic Corpus</a>.
      </p>
    </section>
  )
}

export default RootPage
