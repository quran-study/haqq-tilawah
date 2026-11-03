import { useEffect, useState } from 'react'
import Acknowledgements from './Acknowledgements.tsx'
import { REPO_URL } from './config.ts'
import Home from './Home.tsx'
import Reader from './Reader.tsx'
import RootPage from './RootPage.tsx'
import Roots from './Roots.tsx'
import Search from './Search.tsx'
import SurahList from './SurahList.tsx'

type Route =
  | { page: 'home' }
  | { page: 'acknowledgements' }
  | { page: 'quran' }
  | { page: 'surah'; n: number; ayah?: number }
  | { page: 'search'; query: string }
  | { page: 'roots' }
  | { page: 'root'; root: string }

// #/quran, #/surah/2, #/surah/2/121, #/search/<query>, #/roots, #/root/<root>, #/acknowledgements
function routeFromHash(): Route {
  const hash = window.location.hash
  if (hash === '#/acknowledgements') return { page: 'acknowledgements' }
  if (hash === '#/quran') return { page: 'quran' }
  if (hash === '#/roots') return { page: 'roots' }
  const surah = /^#\/surah\/(\d+)(?:\/(\d+))?$/.exec(hash)
  if (surah) {
    const n = Number(surah[1])
    if (n >= 1 && n <= 114) return { page: 'surah', n, ayah: surah[2] ? Number(surah[2]) : undefined }
  }
  const search = /^#\/search(?:\/(.*))?$/.exec(hash)
  if (search) return { page: 'search', query: decodeURIComponent(search[1] ?? '') }
  const root = /^#\/root\/(.+)$/.exec(hash)
  if (root) return { page: 'root', root: decodeURIComponent(root[1]) }
  return { page: 'home' }
}

const SECTIONS = [
  ['home', '#/', 'Home'],
  ['quran', '#/quran', 'Quran'],
  ['search', '#/search', 'Search'],
  ['roots', '#/roots', 'Roots'],
  ['acknowledgements', '#/acknowledgements', 'Sources'],
] as const

function App() {
  const [route, setRoute] = useState<Route>(routeFromHash)

  useEffect(() => {
    const onHashChange = () => {
      setRoute(routeFromHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const section = route.page === 'surah' ? 'quran' : route.page === 'root' ? 'roots' : route.page

  return (
    <>
      <header className="site-header">
        <a href="#/" className="brand">
          Haqq Tilawah <span lang="ar" dir="rtl">حَقَّ تِلَاوَتِهِۦ</span>
        </a>
        <nav>
          {SECTIONS.map(([key, href, label]) => (
            <a key={key} href={href} aria-current={section === key ? 'page' : undefined}>
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        {route.page === 'home' && <Home />}
        {route.page === 'quran' && <SurahList />}
        {route.page === 'surah' && <Reader key={route.n} n={route.n} ayah={route.ayah} />}
        {route.page === 'search' && <Search key={route.query} query={route.query} />}
        {route.page === 'roots' && <Roots />}
        {route.page === 'root' && <RootPage key={route.root} root={route.root} />}
        {route.page === 'acknowledgements' && <Acknowledgements />}
      </main>

      <footer className="site-footer">
        <p>
          Free and open source under the{' '}
          <a href="https://www.gnu.org/licenses/gpl-3.0.html">GNU GPL v3</a>. Quran text from{' '}
          <a href="https://tanzil.net">Tanzil</a>, word grammar from the{' '}
          <a href="https://corpus.quran.com">Quranic Arabic Corpus</a>.{' '}
          <a href={REPO_URL}>Source code</a> · <a href="#/acknowledgements">Sources and terms</a>
        </p>
      </footer>
    </>
  )
}

export default App
