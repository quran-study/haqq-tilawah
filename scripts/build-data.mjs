// Builds the app's Quran data from the unchanged Tanzil source files in data/raw/tanzil.
// The Arabic text and translation are copied ayah by ayah exactly as published;
// this script only reorganises them into per-surah JSON files.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const rawDir = join(root, 'data/raw/tanzil')
const outDir = join(root, 'public/data')

const TOTAL_AYAHS = 6236
const TOTAL_SURAHS = 114

function fail(message) {
  console.error(`build-data: ${message}`)
  process.exit(1)
}

// "sura|aya|text" lines; lines starting with # are the copyright notice
function readAyahFile(name) {
  const lines = readFileSync(join(rawDir, name), 'utf8').split('\n')
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
  const js = readFileSync(join(rawDir, 'quran-data.js'), 'utf8')
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

const quran = readAyahFile('quran-uthmani.txt')
const sahih = readAyahFile('en.sahih.txt')
const surahs = readSurahMetadata()

const sources = {
  text: 'Tanzil Quran Text (Uthmani, Version 1.1), Copyright (C) 2007-2026 Tanzil Project, CC BY 3.0. Changing the text is not allowed. https://tanzil.net',
  translation: 'Saheeh International (en.sahih) via Tanzil.net, for non-commercial use. https://tanzil.net/trans/',
  notice: 'See NOTICE.txt for the full copyright notices.',
}

rmSync(outDir, { recursive: true, force: true })
mkdirSync(join(outDir, 'surah'), { recursive: true })

for (const surah of surahs) {
  const ayahs = []
  for (let a = 1; a <= surah.ayahs; a++) {
    const ar = quran.ayahs.get(`${surah.n}:${a}`)
    const en = sahih.ayahs.get(`${surah.n}:${a}`)
    if (ar === undefined || en === undefined) fail(`missing ${surah.n}:${a}`)
    ayahs.push([ar, en])
  }
  writeFileSync(join(outDir, 'surah', `${surah.n}.json`), JSON.stringify({ n: surah.n, sources, ayahs }))
}

// Shown on the home page; the app's name comes from this ayah
const featured = { surah: 2, ayah: 121, ar: quran.ayahs.get('2:121'), en: sahih.ayahs.get('2:121') }
const bismillah = quran.ayahs.get('1:1')

writeFileSync(join(outDir, 'surahs.json'), JSON.stringify({ sources, bismillah, featured, surahs }))
writeFileSync(join(outDir, 'NOTICE.txt'), `${quran.notice}\n\n${sahih.notice}\n\nTranslations from Tanzil are for non-commercial purposes only. If used otherwise, permission is needed from the translator or the publisher. See https://tanzil.net/trans/\n`)

console.log(`build-data: wrote ${surahs.length} surahs and ${TOTAL_AYAHS} ayahs to public/data`)
