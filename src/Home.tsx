import { REPO_URL } from './config.ts'

// Al-Baqarah 2:121, verbatim from Tanzil (Uthmani) and Sahih International via Tanzil
const AYAH_AR =
  'ٱلَّذِينَ ءَاتَيْنَٰهُمُ ٱلْكِتَٰبَ يَتْلُونَهُۥ حَقَّ تِلَاوَتِهِۦٓ أُو۟لَٰٓئِكَ يُؤْمِنُونَ بِهِۦ ۗ وَمَن يَكْفُرْ بِهِۦ فَأُو۟لَٰٓئِكَ هُمُ ٱلْخَٰسِرُونَ'
const AYAH_EN =
  'Those to whom We have given the Book recite it with its true recital. They [are the ones who] believe in it. And whoever disbelieves in it - it is they who are the losers.'

const ROADMAP = [
  ['Read', 'The full Quran with translation, available offline once loaded.'],
  ['Word by word', 'Tap any word to see its root, lemma and grammar.'],
  ['Search', 'Find ayahs by word, root or translation, in Arabic or English.'],
  ['Explore', 'Synonyms, themes and connections between words across the Quran.'],
]

function Home() {
  return (
    <>
      <section className="hero">
        <p className="ayah" lang="ar" dir="rtl">
          {AYAH_AR}
        </p>
        <p className="translation">“{AYAH_EN}”</p>
        <p className="reference">
          Al-Baqarah 2:121 · Sahih International
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
