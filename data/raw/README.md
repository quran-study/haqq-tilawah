# Raw source data

These files are kept **exactly as downloaded**, including their copyright notices. Do not edit them. `scripts/build-data.mjs` reads them and writes the app's data to `public/data/` (generated, not committed).

To update a source, download the new file, replace the old one, update the table below and run `pnpm data`.

## tanzil/

Downloaded 3 November 2026 from the [Tanzil Project](https://tanzil.net).

| File | What it is | Download | Licence | SHA-256 |
|---|---|---|---|---|
| `quran-uthmani.txt` | Quran text, Uthmani script, version 1.1. Pause marks and sajdah signs on; rub-el-hizb signs off. Format `sura\|aya\|text`. | [tanzil.net/download](https://tanzil.net/download/) | CC BY 3.0. Changing the text is not allowed. | `7f30c647331a61100ebf24a80507dc0fcdd9f2df97f1312b5b2dfcb982a7f326` |
| `en.sahih.txt` | Saheeh International English translation (last updated by Tanzil 24 April 2011). | [tanzil.net/trans](https://tanzil.net/trans/) | Non-commercial use only, per Tanzil's translation terms. | `a1778a1a56695d9b59ae910809ec46d9f4a55f05961de51cd56e6ebcf9040883` |
| `quran-simple-clean.txt` | Quran text, Simple Clean (no vowel marks, standard spelling), version 1.1. Used for search only. | [tanzil.net/download](https://tanzil.net/download/) | CC BY 3.0. Changing the text is not allowed. | `228df2a717671aeb9d2ff573002bd28d6b3f973f4bc7153554e3a81663d67610` |
| `en.yusufali.txt` | Abdullah Yusuf Ali English translation (last updated by Tanzil 10 May 2013). | [tanzil.net/trans](https://tanzil.net/trans/) | Non-commercial use only, per Tanzil's translation terms. | `2a8198755e8ae9be39e9bb2d81824d347edcaf23b36d50ce380f6f128c486759` |
| `quran-data.js` | Quran metadata (surah names, ayah counts, juz, pages and so on), version 1.0. Parsed as data, never executed. | [tanzil.net/docs/quran_metadata](https://tanzil.net/docs/quran_metadata) | CC BY 3.0 | `9e9930c592aaa34b5c7a79ff4e99ffdc782263a266090bfe2c49e4ed4bac4ca4` |

## corpus/

| File | What it is | Source | Licence | SHA-256 |
|---|---|---|---|---|
| `quranic-corpus-morphology-0.4.txt` | Quranic Arabic Corpus morphology, version 0.4 (the latest release). Every word's segments, part-of-speech tags, features, root and lemma, in the Corpus's Buckwalter transliteration. | [corpus.quran.com/download](https://corpus.quran.com/download/) (requires registration). This verbatim copy, with its copyright notice intact, was taken from the [qurandev](https://github.com/qurandev/qurandev) repository; three copies there are byte-for-byte identical. | GNU GPL. Changing the file is not allowed. | `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d` |
