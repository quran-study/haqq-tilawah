import type { CSSProperties } from 'react'
import { toArabicDigits, type Token } from './data.ts'

type Props = {
  tokens: Token[]
  ayah: number
  // Displayed token positions (1-based) to highlight
  highlight?: Set<number>
  // Called with the token position (1-based) when a word is tapped
  onWord?: (token: number) => void
  selected?: Set<number>
  style?: CSSProperties
}

// An ayah as tappable words, followed by its end-of-ayah marker
function AyahText({ tokens, ayah, highlight, onWord, selected, style }: Props) {
  return (
    <p className="ayah-ar" lang="ar" dir="rtl" style={style}>
      {tokens.map((t, i) => {
        const pos = i + 1
        const classes = [
          t.word && onWord ? 'w' : '',
          highlight?.has(pos) ? 'hit' : '',
          selected?.has(pos) ? 'selected' : '',
        ]
          .filter(Boolean)
          .join(' ')
        return (
          <span key={pos}>
            {t.word && onWord ? (
              <button type="button" className={classes} onClick={() => onWord(pos)}>
                {t.text}
              </button>
            ) : (
              <span className={classes || undefined}>{t.text}</span>
            )}{' '}
          </span>
        )
      })}
      <span className="ayah-end" aria-label={`Ayah ${ayah}`}>
        {'\u06DD'}
        {toArabicDigits(ayah)}
      </span>
    </p>
  )
}

export default AyahText
