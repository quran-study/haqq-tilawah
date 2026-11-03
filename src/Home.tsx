import { useEffect, useState } from 'react'
import { REPO_URL } from './config.ts'
import { loadSurahIndex, type SurahIndex } from './data.ts'

const ROADMAP = [
  ['Read', 'The full Quran with translation, available offline. Ready now.'],
  ['Word by word', 'Tap any word to see its root, lemma and grammar.'],
  ['Search', 'Find ayahs by word, root or translation, in Arabic or English.'],
  ['Explore', 'Synonyms, themes and connections between words across the Quran.'],
]

function Home() {
  const [featured, setFeatured] = useState<SurahIndex['featured']>()

  useEffect(() => {
    loadSurahIndex()
      .then((index) => setFeatured(index.featured))
      .catch(() => setFeatured(undefined))
  }, [])

  return (
    <>
      <section className="hero">
        {featured && (
          <>
            <p className="ayah" lang="ar" dir="rtl">
              {featured.ar}
            </p>
            <p className="translation">“{featured.en}”</p>
            <p className="reference">
              <a href={`#/surah/${featured.surah}/${featured.ayah}`}>
                Al-Baqarah {featured.surah}:{featured.ayah}
              </a>{' '}
              · Saheeh International
            </p>
          </>
        )}
        <p>
          <a className="button" href="#/quran">
            Start reading
          </a>
        </p>
      </section>

      <section>
        <h1>Study the Quran as it deserves to be studied</h1>
        <p>
          <strong>Haqq Tilawah</strong> takes its name from the ayah above:
          reciting the Book <em>with its true recital</em>, which scholars
          explain as reading, understanding, reflecting on and acting on it.
          This app aims to make that kind of study easier for everyone, on any
          device, with or without an internet connection.
        </p>
      </section>

      <section>
        <h2>What’s coming</h2>
        <ul className="roadmap">
          {ROADMAP.map(([title, text]) => (
            <li key={title}>
              <strong>{title}</strong>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="callout">
        <h2>Open source, for the whole community</h2>
        <p>
          Haqq Tilawah is free and open source. Anyone is welcome to use it,
          learn from it, improve it or build something new on top of it, so
          that its benefit keeps spreading. The code is shared under the GNU
          GPL v3, and the Quran text, translations and linguistic data come
          from trusted projects whose terms we follow and credit.
        </p>
        <p>
          <a href={REPO_URL}>View the source code</a> ·{' '}
          <a href="#/acknowledgements">See our sources and their terms</a>
        </p>
      </section>
    </>
  )
}

export default Home
