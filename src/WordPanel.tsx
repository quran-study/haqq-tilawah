import { useEffect, useState } from 'react'
import { loadRoots, type Root, type Word } from './data.ts'
import { corpusWordUrl, describeSegment, spacedRoot } from './grammar.ts'

type Props = {
  surah: number
  ayah: number
  // Position of the word in the ayah (1-based), as numbered by the Corpus
  index: number
  word: Word
  text: string
  onClose: () => void
}

function WordPanel({ surah, ayah, index, word, text, onClose }: Props) {
  const [, root, lemma, lemmaId, segments] = word
  const [rootInfo, setRootInfo] = useState<Root>()

  useEffect(() => {
    if (!root) return
    loadRoots()
      .then((roots) => setRootInfo(roots.find((r) => r.r === root)))
      .catch(() => setRootInfo(undefined))
  }, [root])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const lemmaCount = rootInfo?.lemmas.find((l) => l.k === lemmaId)?.n

  return (
    <aside className="word-panel" aria-label="Word details">
      <header>
        <p className="word-panel-word" lang="ar" dir="rtl">
          {text}
        </p>
        <span className="muted">
          {surah}:{ayah}, word {index}
        </span>
        <button type="button" className="close" aria-label="Close word details" onClick={onClose}>
          ×
        </button>
      </header>

      <ol className="segments">
        {segments.map(([form, tag, features], i) => {
          const info = describeSegment(tag, features)
          return (
            <li key={i}>
              <span className="segment-ar" lang="ar" dir="rtl">
                {form}
              </span>
              <span>
                <strong>{info.label}</strong>
                {info.details.length > 0 && <span className="muted"> · {info.details.join(' · ')}</span>}
                <span className="segment-part">{info.part}</span>
              </span>
            </li>
          )
        })}
      </ol>

      {(root || lemma) && (
        <dl className="word-facts">
          {root && (
            <div>
              <dt>Root</dt>
              <dd>
                <a href={`#/root/${encodeURIComponent(root)}`} lang="ar" dir="rtl" className="root-link">
                  {spacedRoot(root)}
                </a>
                {rootInfo && (
                  <span className="muted">
                    {' '}
                    {rootInfo.n} times in the Quran, in {rootInfo.lemmas.length}{' '}
                    {rootInfo.lemmas.length === 1 ? 'form' : 'forms'}
                  </span>
                )}
              </dd>
            </div>
          )}
          {lemma && (
            <div>
              <dt>Lemma</dt>
              <dd>
                <span lang="ar" dir="rtl" className="lemma">
                  {lemma}
                </span>
                {lemmaCount && <span className="muted"> {lemmaCount} times in the Quran</span>}
              </dd>
            </div>
          )}
        </dl>
      )}

      <p className="word-credit">
        Grammar from the <a href={corpusWordUrl(surah, ayah, index)}>Quranic Arabic Corpus</a>
      </p>
    </aside>
  )
}

export default WordPanel
