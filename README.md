# Haqq Tilawah · حَقَّ تِلَاوَتِهِۦ

> ٱلَّذِينَ ءَاتَيْنَٰهُمُ ٱلْكِتَٰبَ يَتْلُونَهُۥ حَقَّ تِلَاوَتِهِۦٓ
>
> *"Those to whom We have given the Book recite it with its true recital…"* (Al-Baqarah 2:121)

**Haqq Tilawah** is a free, open-source Quran study app. It aims to help people study the Quran as it deserves to be studied: reading it, understanding its words, reflecting on it and acting on it.

It runs in any web browser, on phones, tablets and computers. It can be added to your home screen like an app and works offline, with no app store needed.

**Live app:** https://quran-study.github.io/haqq-tilawah/

## Open source, for the whole community

This project is open source so that anyone can benefit from it and build on it. You are warmly welcome to:

- use it for your own study, teaching or halaqah
- learn from the code
- suggest improvements, report mistakes or contribute features
- build your own Quran tools on top of it

The code is released under the [GNU General Public License v3](LICENSE). In short: you are free to use, study, share and change it. If you share a modified version, it must stay open source under the same licence, so the benefit keeps spreading.

## Sources and acknowledgements

Haqq Tilawah builds on the work of trusted projects. We credit each one and follow its terms. If you build on this project, **please keep these credits and respect the same terms**.

| Source | What it provides | Key terms |
|---|---|---|
| [Tanzil Project](https://tanzil.net) | Verified Arabic Quran text and metadata | CC BY-ND 3.0. The text must not be changed. Credit and link to Tanzil. |
| Translations via [Tanzil](https://tanzil.net/trans/) | Translations of the meanings (starting with Sahih International) | Each translation has its own terms, checked before it is added. |
| [Quranic Arabic Corpus](https://corpus.quran.com) *(planned)* | Word-by-word morphology: roots, lemmas, grammar | GNU GPL. The data file must not be changed. Credit and link to the Corpus, and keep its copyright notice. |
| [Amiri Quran](https://www.amirifont.org) | Arabic typeface | SIL Open Font License |
| [qurandev](https://github.com/qurandev) | The original ideas and research tools this app grew from | The author invites others to "take the idea, improve on it and host on your own site". |

See [ACKNOWLEDGEMENTS.md](ACKNOWLEDGEMENTS.md) for full details, or the Acknowledgements page in the app.

**The Quran text is never altered.** If you spot any mistake in the text, a translation or a credit, please [open an issue](https://github.com/quran-study/haqq-tilawah/issues).

## Roadmap

- [x] Installable, offline-ready app shell
- [ ] Quran reader with translation
- [ ] Word by word: root, lemma and grammar for every word
- [ ] Search by word, root or translation
- [ ] Synonyms, themes and connections between words

## Running it locally

You need [Node.js](https://nodejs.org) 20 or later and [pnpm](https://pnpm.io).

```sh
pnpm install
pnpm dev       # start a local development server
pnpm build     # build the production app into dist/
pnpm preview   # serve the production build locally
```

Every push to `main` is built and published to GitHub Pages automatically.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).
