const QURANDEV_README =
  'https://github.com/qurandev/qurandev/blob/87988bc708830a47662bf5917ee2b4cd1b2b4834/README'

type Source = {
  name: string
  url: string
  provides: string
  terms: string[]
  status: 'In use' | 'Planned'
}

const SOURCES: Source[] = [
  {
    name: 'Tanzil Project',
    url: 'https://tanzil.net',
    provides: 'The verified Arabic Quran text (Uthmani script) and Quran metadata.',
    terms: [
      'Licensed under Creative Commons BY-ND 3.0.',
      'Verbatim copies may be shared, but the text must not be changed. We never alter it.',
      'May be used in any website or application if Tanzil is credited and linked, so users can keep track of updates.',
    ],
    status: 'In use',
  },
  {
    name: 'Sahih International (via Tanzil)',
    url: 'https://tanzil.net/trans/',
    provides: 'English translation of the meanings of the Quran.',
    terms: [
      'Translations on Tanzil carry their own terms, set by each translator or publisher.',
      'We show the translation unchanged and credit it by name. Each translation is checked before it is added.',
    ],
    status: 'In use',
  },
  {
    name: 'Quranic Arabic Corpus',
    url: 'https://corpus.quran.com',
    provides: 'Word-by-word morphology: roots, lemmas and grammatical analysis.',
    terms: [
      'Copyright © Kais Dukes, licensed under the GNU General Public License.',
      'Verbatim copies may be shared, but the data file must not be changed.',
      'May be used in any website or application if the Corpus is credited and linked, with its copyright notice kept.',
    ],
    status: 'Planned',
  },
  {
    name: 'Amiri Quran font',
    url: 'https://www.amirifont.org',
    provides: 'The typeface used to display the Arabic text.',
    terms: ['Licensed under the SIL Open Font License.'],
    status: 'In use',
  },
]

function Acknowledgements() {
  return (
    <>
      <section>
        <h1>Acknowledgements</h1>
        <p>
          Haqq Tilawah stands on the work of others. We are grateful to every
          project below, and we follow each one’s terms of use. If you build on
          Haqq Tilawah, please keep these credits and respect the same terms.
        </p>
      </section>

      <section>
        <h2>Sources</h2>
        <div className="sources">
          {SOURCES.map((s) => (
            <article key={s.name} className="source">
              <header>
                <h3>
                  <a href={s.url}>{s.name}</a>
                </h3>
                <span className={`status status-${s.status === 'In use' ? 'used' : 'planned'}`}>
                  {s.status}
                </span>
              </header>
              <p>{s.provides}</p>
              <ul>
                {s.terms.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Inspiration: qurandev</h2>
        <p>
          The ideas behind this app (offline browser tools for exploring roots,
          words, synonyms and search) come from the{' '}
          <a href="https://github.com/qurandev">qurandev</a> research tools. Their
          author kindly wrote:
        </p>
        <blockquote>
          “You are welcome to take the idea, improve on it and host on your own
          site.”
          <cite>
            <a href={QURANDEV_README}>qurandev README</a>
          </cite>
        </blockquote>
        <p>May Allah reward them for sharing their work.</p>
      </section>

      <section>
        <h2>This app’s licence</h2>
        <p>
          Haqq Tilawah’s own code is released under the{' '}
          <a href="https://www.gnu.org/licenses/gpl-3.0.html">
            GNU General Public License v3
          </a>
          . You are free to use, study, share and change it. If you share a
          modified version, it must stay open source under the same licence.
          The software comes with no warranty.
        </p>
        <p>
          Spotted a mistake in the text, a translation or a credit? Please{' '}
          <a href="https://github.com/quran-study/haqq-tilawah/issues">
            open an issue
          </a>{' '}
          so it can be fixed.
        </p>
      </section>
    </>
  )
}

export default Acknowledgements
