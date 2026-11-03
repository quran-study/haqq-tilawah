# Raw source data

These files are kept **exactly as downloaded**, including their copyright notices. Do not edit them. `scripts/build-data.mjs` reads them and writes the app's data to `public/data/` (generated, not committed).

To update a source, download the new file, replace the old one, update the table below and run `pnpm data`.

## tanzil/

Downloaded 3 November 2026 from the [Tanzil Project](https://tanzil.net).

| File | What it is | Download | Licence | SHA-256 |
|---|---|---|---|---|
| `quran-uthmani.txt` | Quran text, Uthmani script, version 1.1. Pause marks and sajdah signs on; rub-el-hizb signs off. Format `sura\|aya\|text`. | [tanzil.net/download](https://tanzil.net/download/) | CC BY 3.0. Changing the text is not allowed. | `7f30c647331a61100ebf24a80507dc0fcdd9f2df97f1312b5b2dfcb982a7f326` |
| `en.sahih.txt` | Saheeh International English translation (last updated by Tanzil 24 April 2011). | [tanzil.net/trans](https://tanzil.net/trans/) | Non-commercial use only, per Tanzil's translation terms. | `a1778a1a56695d9b59ae910809ec46d9f4a55f05961de51cd56e6ebcf9040883` |
| `quran-data.js` | Quran metadata (surah names, ayah counts, juz, pages and so on), version 1.0. Parsed as data, never executed. | [tanzil.net/docs/quran_metadata](https://tanzil.net/docs/quran_metadata) | CC BY 3.0 | `9e9930c592aaa34b5c7a79ff4e99ffdc782263a266090bfe2c49e4ed4bac4ca4` |
