// Reads the Quranic Arabic Corpus morphology file (kept unchanged in data/raw/corpus).
import { readFileSync } from 'node:fs'

// The Corpus's extended Buckwalter transliteration, mapped back to Arabic script.
// https://corpus.quran.com/java/buckwalter.jsp
const BUCKWALTER = {
  "'": '\u0621', '>': '\u0623', '&': '\u0624', '<': '\u0625', '}': '\u0626',
  A: '\u0627', b: '\u0628', p: '\u0629', t: '\u062A', v: '\u062B', j: '\u062C',
  H: '\u062D', x: '\u062E', d: '\u062F', '*': '\u0630', r: '\u0631', z: '\u0632',
  s: '\u0633', $: '\u0634', S: '\u0635', D: '\u0636', T: '\u0637', Z: '\u0638',
  E: '\u0639', g: '\u063A', _: '\u0640', f: '\u0641', q: '\u0642', k: '\u0643',
  l: '\u0644', m: '\u0645', n: '\u0646', h: '\u0647', w: '\u0648', Y: '\u0649',
  y: '\u064A', F: '\u064B', N: '\u064C', K: '\u064D', a: '\u064E', u: '\u064F',
  i: '\u0650', '~': '\u0651', o: '\u0652', '^': '\u0653', '#': '\u0654',
  '`': '\u0670', '{': '\u0671', ':': '\u06DC', '@': '\u06DF', '"': '\u06E0',
  '[': '\u06E2', ';': '\u06E3', ',': '\u06E5', '.': '\u06E6', '!': '\u06E8',
  '-': '\u06EA', '+': '\u06EB', '%': '\u06EC', ']': '\u06ED', '|': '\u0622',
  // 37:130 is a single Corpus word written as two (إِلْ يَاسِينَ)
  ' ': ' ',
}

export function toArabic(buckwalter) {
  let out = ''
  for (const ch of buckwalter) {
    const ar = BUCKWALTER[ch]
    if (ar === undefined) throw new Error(`Unknown Buckwalter character "${ch}" in "${buckwalter}"`)
    out += ar
  }
  return out
}

// Returns { notice, words } where words maps "sura:aya" to an array of words,
// each word an array of segments { form, tag, features }.
export function readCorpus(path) {
  const notice = []
  const words = new Map()
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    if (line.startsWith('#')) {
      notice.push(line)
      continue
    }
    const m = /^\((\d+):(\d+):(\d+):(\d+)\)\t([^\t]*)\t([^\t]*)\t(.*)$/.exec(line)
    if (!m) continue
    const key = `${m[1]}:${m[2]}`
    const w = Number(m[3]) - 1
    if (!words.has(key)) words.set(key, [])
    const ayah = words.get(key)
    ayah[w] ??= []
    ayah[w].push({ form: m[5], tag: m[6], features: m[7].split('|') })
  }
  return { notice: notice.join('\n'), words }
}

export function feature(segment, name) {
  const f = segment.features.find((x) => x.startsWith(`${name}:`))
  return f?.slice(name.length + 1)
}

// Pause marks and the sajdah sign appear as separate space-separated tokens in Tanzil's text
const MARKS = /^[\u06D6-\u06DC\u06DE\u06E9]+$/

// Splits a Tanzil ayah into tokens, flagging which ones are words (not pause marks)
export function tokenize(ayahText) {
  return ayahText.split(' ').map((t) => ({ text: t, word: !MARKS.test(t) }))
}
