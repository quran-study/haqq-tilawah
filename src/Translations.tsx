import type { ReactNode } from 'react'
import type { Translation } from './data.ts'

type Props = {
  // The ayah row: [Arabic, ...translations]
  row: string[]
  all: Translation[]
  shown: string[]
  // Optional prefix (e.g. the ayah reference) for the first translation
  prefix?: ReactNode
  highlight?: (text: string) => ReactNode
}

// The chosen translations of one ayah, labelled when more than one is shown
function Translations({ row, all, shown, prefix, highlight }: Props) {
  const visible = all.map((t, i) => ({ ...t, text: row[i + 1] })).filter((t) => shown.includes(t.id))
  return visible.map((t, i) => (
    <p key={t.id} className="ayah-en">
      {i === 0 && prefix}
      {visible.length > 1 && <span className="translation-name">{t.name}</span>}
      {highlight ? highlight(t.text) : t.text}
    </p>
  ))
}

export default Translations
