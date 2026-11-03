const QURANDEV_README =
  'https://github.com/qurandev/qurandev/blob/87988bc708830a47662bf5917ee2b4cd1b2b4834/README'

type Source = {
  name: string
  url: string
  provides: string
  terms: string[]
}

const SOURCES: Source[] = [
  {
    name: 'Tanzil Project',
    url: 'https://tanzil.net',
    provides:
      'The verified Arabic Quran text (Uthmani script, version 1.1), the Simple Clean text used for searching, and Quran metadata such as surah names and ayah counts.',
    terms: [
      'Licensed under Creative Commons Attribution 3.0.',
      'Verbatim copies may be shared, but the text must not be changed. We never alter it.',
      'May be used in any website or application if Tanzil is credited and linked, so users can keep track of updates.',
      'The copyright notice must be kept with the text and in files derived from it. We include it with the app’s data.',
    ],
  },
  {
    name: 'Translations (via Tanzil)',
    url: 'https://tanzil.net/trans/',
    provides:
      'English translations of the meanings of the Quran: Saheeh International, and Abdullah Yusuf Ali’s translation.',
    terms: [
      'Tanzil’s translations are for non-commercial purposes only. Any other use needs permission from the translator or publisher.',
      'We show each translation unchanged and credit it by name. Each translation’s terms are checked before it is added.',
      'If you build on Haqq Tilawah for commercial use, you must get permission for translations or remove them.',
    ],
  },
  {
    name: 'Quranic Arabic Corpus',
    url: 'https://corpus.quran.com',
    provides:
      'Word-by-word morphology (version 0.4): the parts, grammar, root and lemma of every word, used for word details, roots and lemmas.',
    terms: [
      'Copyright © Kais Dukes, licensed under the GNU General Public License.',
      'Verbatim copies may be shared, but the data file must not be changed. We keep it unchanged and only read from it.',
      'May be used in any website or application if the Corpus is credited and linked, with its copyright notice kept. Every word panel links to the word on corpus.quran.com.',
      'The Corpus is based on an earlier edition of the Tanzil text (1.0.2); every word has been checked to line up with the text shown here.',
    ],
  },
  {
    name: 'Amiri Quran font',
    url: 'https://www.amirifont.org',
    provides: 'The typeface used to display the Arabic text.',
    terms: ['Licensed under the SIL Open Font License.'],
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
          words and search) come from the{' '}
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
