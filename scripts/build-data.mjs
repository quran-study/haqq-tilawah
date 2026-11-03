// Builds the app's data from the unchanged source files in data/raw.
// The Arabic text and translation are copied ayah by ayah exactly as published;
// this script only reorganises them into JSON files for the app.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { feature, readCorpus, toArabic, tokenize } from './corpus.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const rawDir = join(root, 'data/raw')
const outDir = join(root, 'public/data')

const TOTAL_AYAHS = 6236
const TOTAL_SURAHS = 114

function fail(message) {
  console.error(`build-data: ${message}`)
  process.exit(1)
}

// "sura|aya|text" lines; lines starting with # are the copyright notice
function readAyahFile(name) {
  const lines = readFileSync(join(rawDir, 'tanzil', name), 'utf8').split('\n')
  const ayahs = new Map()
  const notice = []
  for (const line of lines) {
    if (line.startsWith('#')) notice.push(line)
    if (!/^\d+\|\d+\|/.test(line)) continue
    const [s, a, ...rest] = line.split('|')
    ayahs.set(`${s}:${a}`, rest.join('|'))
  }
  if (ayahs.size !== TOTAL_AYAHS) fail(`${name} has ${ayahs.size} ayahs, expected ${TOTAL_AYAHS}`)
  return { ayahs, notice: notice.join('\n') }
}

// Parses the QuranData.Sura table as data (the downloaded file is never executed)
function readSurahMetadata() {
  const js = readFileSync(join(rawDir, 'tanzil/quran-data.js'), 'utf8')
  const table = js.slice(js.indexOf('QuranData.Sura = ['), js.indexOf('];', js.indexOf('QuranData.Sura')))
  const row = /\[(\d+), (\d+), (\d+), (\d+), '([^']+)', "([^"]+)", '([^']+)', '(Meccan|Medinan)'\]/g
  const surahs = [...table.matchAll(row)].map((m, i) => ({
    n: i + 1,
    ar: m[5],
    tr: m[6],
    en: m[7],
    ayahs: Number(m[2]),
    type: m[8],
    order: Number(m[3]),
  }))
  if (surahs.length !== TOTAL_SURAHS) fail(`metadata has ${surahs.length} surahs, expected ${TOTAL_SURAHS}`)
  const total = surahs.reduce((sum, s) => sum + s.ayahs, 0)
  if (total !== TOTAL_AYAHS) fail(`metadata lists ${total} ayahs, expected ${TOTAL_AYAHS}`)
  return surahs
}

// Letters only: drops vowel marks, Quranic annotation signs, tatweel, spaces and standalone
// hamza (Tanzil 1.1 sometimes writes ء as ـٔ, a tatweel carrying a hamza)
const skeleton = (text) => text.replace(/[\u0621\u064B-\u065F\u0670\u06D6-\u06ED\u0640\s]/g, '')

// Translations from Tanzil, in the order they are offered in the app
const TRANSLATIONS = [
  { id: 'en.sahih', name: 'Saheeh International', language: 'English' },
  { id: 'en.yusufali', name: 'Yusuf Ali', translator: 'Abdullah Yusuf Ali', language: 'English' },
]

const quran = readAyahFile('quran-uthmani.txt')
const simple = readAyahFile('quran-simple-clean.txt')
const translations = TRANSLATIONS.map((t) => ({ ...t, ...readAyahFile(`${t.id}.txt`) }))
const surahs = readSurahMetadata()
const corpus = readCorpus(join(rawDir, 'corpus/quranic-corpus-morphology-0.4.txt'))
if (corpus.words.size !== TOTAL_AYAHS) fail(`Corpus has ${corpus.words.size} ayahs, expected ${TOTAL_AYAHS}`)

// Tanzil places the Bismillah (4 words) at the start of ayah 1 of every surah except 1 and 9.
// The app shows it as a heading, so word positions are counted from after it.
function hasBismillah(s, a) {
  if (s === 1 || s === 9 || a !== 1) return false
  const words = quran.ayahs.get(`${s}:${a}`).split(' ')
  if (skeleton(words[1]) !== 'ٱلله') fail(`expected a Bismillah at the start of ${s}:1`)
  return true
}

const displayText = (map, s, a) => {
  const text = map.get(`${s}:${a}`)
  return hasBismillah(s, a) ? text.split(' ').slice(4).join(' ') : text
}

const sources = {
  text: 'Tanzil Quran Text (Uthmani, Version 1.1), Copyright (C) 2007-2026 Tanzil Project, CC BY 3.0. Changing the text is not allowed. https://tanzil.net',
  translations: `${TRANSLATIONS.map((t) => `${t.name} (${t.id})`).join(', ')} via Tanzil.net, for non-commercial use. https://tanzil.net/trans/`,
  morphology: 'Quranic Arabic Corpus (morphology, version 0.4), Copyright (C) 2011 Kais Dukes, GNU General Public License. https://corpus.quran.com',
  notice: 'See NOTICE.txt for the full copyright notices.',
}

rmSync(outDir, { recursive: true, force: true })
mkdirSync(join(outDir, 'surah'), { recursive: true })
mkdirSync(join(outDir, 'words'), { recursive: true })

// --- Quran text and translations, one file per surah ---
// Each ayah is [Arabic, ...translations in TRANSLATIONS order]
for (const surah of surahs) {
  const ayahs = []
  for (let a = 1; a <= surah.ayahs; a++) {
    const row = [quran, ...translations].map((source) => source.ayahs.get(`${surah.n}:${a}`))
    if (row.includes(undefined)) fail(`missing ${surah.n}:${a}`)
    ayahs.push(row)
  }
  const bismillah = hasBismillah(surah.n, 1)
  writeFileSync(
    join(outDir, 'surah', `${surah.n}.json`),
    JSON.stringify({ n: surah.n, sources, bismillah, ayahs }),
  )
}

// --- Word by word: Corpus words aligned to the displayed Tanzil words ---
// Each Corpus word covers one displayed word. In the few ayahs where Tanzil 1.1 writes a
// Corpus word as two (e.g. بَعْدَ مَا for بَعْدَمَا), words are matched by their letters.
const roots = new Map()
let wordCount = 0
let realigned = 0

for (const surah of surahs) {
  const ayahWords = []
  for (let a = 1; a <= surah.ayahs; a++) {
    const tokens = tokenize(displayText(quran.ayahs, surah.n, a))
    const wordTokens = tokens.map((t, i) => ({ ...t, i })).filter((t) => t.word)
    const words = corpus.words.get(`${surah.n}:${a}`)
    const out = []
    let next = 0
    const oneToOne = words.length === wordTokens.length
    if (!oneToOne) realigned++
    for (const [w, segments] of words.entries()) {
      const start = next
      if (oneToOne) next++
      else {
        const target = skeleton(toArabic(segments.map((g) => g.form).join('')))
        let letters = ''
        while (next < wordTokens.length && letters.length < target.length) letters += skeleton(wordTokens[next++].text)
        if (letters !== target) fail(`word ${surah.n}:${a}:${w + 1} does not line up with the Tanzil text`)
      }

      const stem = segments.find((g) => g.features[0] === 'STEM') ?? segments[0]
      const rootBw = feature(stem, 'ROOT')
      const lemmaBw = feature(stem, 'LEM')
      const rootAr = rootBw ? toArabic(rootBw) : ''
      // The Corpus numbers lemmas that share a spelling (e.g. maE2); the number is kept as an id only
      const lemmaAr = lemmaBw ? toArabic(lemmaBw.replace(/\d+$/, '')) : ''
      const segs = segments.map((g) => [
        toArabic(g.form),
        g.tag,
        g.features.filter((f) => !/^(LEM|ROOT|POS):/.test(f)).join('|'),
      ])
      out.push([next - start, rootAr, lemmaAr, lemmaBw ?? '', segs])
      wordCount++

      if (rootAr) {
        // Location of the word's first displayed token: surah, ayah, token position (1-based)
        const loc = surah.n * 1_000_000 + a * 1_000 + wordTokens[start].i + 1
        if (!roots.has(rootAr)) roots.set(rootAr, { r: rootAr, b: rootBw, n: 0, lemmas: new Map() })
        const r = roots.get(rootAr)
        r.n++
        if (!r.lemmas.has(lemmaBw)) r.lemmas.set(lemmaBw, { l: lemmaAr, k: lemmaBw, n: 0, locs: [] })
        const l = r.lemmas.get(lemmaBw)
        l.n++
        l.locs.push(loc)
      }
    }
    if (next !== wordTokens.length) fail(`${surah.n}:${a} has words the Corpus does not cover`)
    ayahWords.push(out)
  }
  writeFileSync(
    join(outDir, 'words', `${surah.n}.json`),
    JSON.stringify({ n: surah.n, source: sources.morphology, ayahs: ayahWords }),
  )
}

const rootList = [...roots.values()]
  .map((r) => ({ ...r, lemmas: [...r.lemmas.values()].sort((x, y) => y.n - x.n) }))
  .sort((x, y) => x.r.localeCompare(y.r, 'ar'))
writeFileSync(join(outDir, 'roots.json'), JSON.stringify({ source: sources.morphology, roots: rootList }))

// --- Search: Tanzil's simple-clean text (no vowel marks, standard spelling) ---
// Search highlights matching words in the displayed text. Usually the n-th simple word is the
// n-th displayed word, but the simple spelling writes the vocative يا and ها as separate words
// (يا أيها for يَـٰٓأَيُّهَا), so those ayahs get an explicit map. Any ayah that still differs
// is listed without highlighting.
const VOCATIVE = new Set(['يا', 'ها'])
const searchAyahs = []
const wordMaps = {}
const unaligned = []
for (const surah of surahs) {
  for (let a = 1; a <= surah.ayahs; a++) {
    const words = displayText(simple.ayahs, surah.n, a).split(' ')
    const shown = tokenize(displayText(quran.ayahs, surah.n, a)).filter((t) => t.word).length
    if (words.length !== shown) {
      // Each simple word's displayed word (0-based), merging a vocative into the next word
      const map = []
      let d = 0
      words.forEach((w, i) => {
        map.push(d)
        if (!(VOCATIVE.has(w) && i + 1 < words.length && words.length - (i + 1) > shown - d - 1)) d++
      })
      if (d === shown) wordMaps[searchAyahs.length] = map
      else unaligned.push(searchAyahs.length)
    }
    searchAyahs.push(words.join(' '))
  }
}
writeFileSync(
  join(outDir, 'search.json'),
  JSON.stringify({
    source: 'Tanzil Quran Text (Simple Clean, Version 1.1), Copyright (C) 2007-2026 Tanzil Project, CC BY 3.0. https://tanzil.net',
    ayahs: searchAyahs,
    wordMaps,
    unaligned,
  }),
)

// --- Index and notices ---
// Shown on the home page; the app's name comes from this ayah
const featured = {
  surah: 2,
  ayah: 121,
  ar: quran.ayahs.get('2:121'),
  translations: translations.map((t) => [t.name, t.ayahs.get('2:121')]),
}
const bismillah = quran.ayahs.get('1:1')

const translationList = TRANSLATIONS.map(({ id, name, language }) => ({ id, name, language }))
writeFileSync(
  join(outDir, 'surahs.json'),
  JSON.stringify({ sources, bismillah, featured, translations: translationList, surahs }),
)
writeFileSync(
  join(outDir, 'NOTICE.txt'),
  [
    quran.notice,
    simple.notice,
    ...translations.map((t) => t.notice),
    'Translations from Tanzil are for non-commercial purposes only. If used otherwise, permission is needed from the translator or the publisher. See https://tanzil.net/trans/',
    corpus.notice,
  ].join('\n\n') + '\n',
)

console.log(
  `build-data: ${surahs.length} surahs, ${TOTAL_AYAHS} ayahs, ${wordCount} words (${realigned} ayahs aligned by letters), ${rootList.length} roots, ${Object.keys(wordMaps).length} search word maps, ${unaligned.length} ayahs searchable without highlighting`,
)
