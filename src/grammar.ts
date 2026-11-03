// Plain-English descriptions of the Quranic Arabic Corpus tags and features.
// Tag set: https://corpus.quran.com/documentation/tagset.jsp

const TAGS: Record<string, string> = {
  N: 'Noun',
  PN: 'Proper noun',
  ADJ: 'Adjective',
  IMPN: 'Imperative verbal noun',
  PRON: 'Pronoun',
  DEM: 'Demonstrative pronoun',
  REL: 'Relative pronoun',
  T: 'Time adverb',
  LOC: 'Location adverb',
  V: 'Verb',
  P: 'Preposition',
  DET: 'Definite article',
  EMPH: 'Emphatic particle',
  IMPV: 'Imperative particle',
  PRP: 'Particle of purpose',
  CONJ: 'Conjunction',
  SUB: 'Subordinating conjunction',
  ACC: 'Accusative particle',
  AMD: 'Amendment particle',
  ANS: 'Answer particle',
  AVR: 'Aversion particle',
  CAUS: 'Particle of cause',
  CERT: 'Particle of certainty',
  CIRC: 'Circumstantial particle',
  COM: 'Comitative particle',
  COND: 'Conditional particle',
  EQ: 'Equalisation particle',
  EXH: 'Exhortation particle',
  EXL: 'Explanation particle',
  EXP: 'Exceptive particle',
  FUT: 'Future particle',
  INC: 'Inceptive particle',
  INT: 'Particle of interpretation',
  INTG: 'Interrogative particle',
  NEG: 'Negative particle',
  PREV: 'Preventive particle',
  PRO: 'Prohibition particle',
  REM: 'Resumption particle',
  RES: 'Restriction particle',
  RET: 'Retraction particle',
  RSLT: 'Result particle',
  SUP: 'Supplemental particle',
  SUR: 'Surprise particle',
  VOC: 'Vocative particle',
  INL: 'Quranic initials',
}

// Common prefixes, with their usual meaning
const PREFIXES: Record<string, string> = {
  'Al+': '“the”',
  'w:CONJ+': '“and”',
  'f:CONJ+': '“and, so”',
  'w:REM+': '“and” (starting a new sentence)',
  'f:REM+': '“so, then” (starting a new sentence)',
  'bi+': '“with, by, in”',
  'l:P+': '“for, to”',
  'ka+': '“like, as”',
  'ta+': '“by” (in an oath)',
  'w:P+': '“by” (in an oath)',
  'l:EMPH+': '“surely, certainly”',
  'A:INTG+': 'question marker',
  'A:EQ+': '“whether”',
  'ya+': '“O”',
  'ha+': '“O” (calling attention)',
  'sa+': '“will” (future)',
  'f:RSLT+': '“then” (result)',
  'l:PRP+': '“so that, in order to”',
  'w:CIRC+': '“while”',
  'f:SUP+': 'supplemental “so”',
  'w:SUP+': 'supplemental “and”',
  'f:CAUS+': '“because, so”',
  'l:IMPV+': '“let”',
  'w:COM+': '“with”',
}

const PERSON: Record<string, string> = { '1': '1st person', '2': '2nd person', '3': '3rd person' }
const GENDER: Record<string, string> = { M: 'masculine', F: 'feminine' }
const NUMBER: Record<string, string> = { S: 'singular', D: 'dual', P: 'plural' }

function personGenderNumber(code: string): string | undefined {
  const m = /^([123])?([MF])?([SDP])?$/.exec(code)
  if (!code || !m) return undefined
  return [m[1] && PERSON[m[1]], m[2] && GENDER[m[2]], m[3] && NUMBER[m[3]]].filter(Boolean).join(' ')
}

const FEATURES: Record<string, string> = {
  NOM: 'nominative',
  ACC: 'accusative',
  GEN: 'genitive',
  INDEF: 'indefinite',
  PERF: 'perfect (completed action)',
  IMPF: 'imperfect (ongoing action)',
  IMPV: 'imperative (command)',
  PASS: 'passive',
  VN: 'verbal noun',
  'MOOD:JUS': 'jussive mood',
  'MOOD:SUBJ': 'subjunctive mood',
  'SP:<in~': 'from the group of “inna and her sisters”',
  'SP:kaAn': 'from the group of “kāna and her sisters”',
  'SP:kaAd': 'from the group of “kāda and her sisters”',
  '+n:EMPH': 'emphatic nūn',
  '+VOC': 'vocative ending',
}

export type SegmentInfo = {
  part: 'Prefix' | 'Stem' | 'Suffix'
  label: string
  details: string[]
}

export function describeSegment(tag: string, features: string): SegmentInfo {
  const list = features.split('|')
  const part = list[0] === 'PREFIX' ? 'Prefix' : list[0] === 'SUFFIX' ? 'Suffix' : 'Stem'
  const details: string[] = []
  const participle = list.includes('PCPL')

  for (const f of list.slice(1)) {
    if (PREFIXES[f]) details.push(PREFIXES[f])
    else if (/^\((I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)\)$/.test(f)) details.push(`verb form ${f.slice(1, -1)}`)
    else if (f.startsWith('PRON:')) details.push(personGenderNumber(f.slice(5)) ?? f)
    else if (f === 'ACT' && participle) details.push('active participle')
    else if (f === 'PASS' && participle) details.push('passive participle')
    else if (f === 'PCPL') continue
    else if (FEATURES[f]) details.push(FEATURES[f])
    else {
      const pgn = personGenderNumber(f)
      if (pgn) details.push(pgn)
    }
  }
  return { part, label: TAGS[tag] ?? tag, details }
}

export const corpusWordUrl = (surah: number, ayah: number, word: number) =>
  `https://corpus.quran.com/wordmorphology.jsp?location=(${surah}:${ayah}:${word})`

export const spacedRoot = (root: string) => [...root].join(' ')
