import { useEffect, useState } from 'react'
import Acknowledgements from './Acknowledgements.tsx'
import { REPO_URL } from './config.ts'
import Home from './Home.tsx'
import Reader from './Reader.tsx'
import SurahList from './SurahList.tsx'

type Route =
  | { page: 'home' }
  | { page: 'acknowledgements' }
  | { page: 'quran' }
  | { page: 'surah'; n: number; ayah?: number }

// #/quran, #/surah/2, #/surah/2/121, #/acknowledgements
function routeFromHash(): Route {
  const hash = window.location.hash
  if (hash === '#/acknowledgements') return { page: 'acknowledgements' }
  if (hash === '#/quran') return { page: 'quran' }
  const m = /^#\/surah\/(\d+)(?:\/(\d+))?$/.exec(hash)
  if (m) {
    const n = Number(m[1])
    if (n >= 1 && n <= 114) return { page: 'surah', n, ayah: m[2] ? Number(m[2]) : undefined }
  }
  return { page: 'home' }
}

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

  const section = route.page === 'surah' ? 'quran' : route.page

  return (
    <>
      <header className="site-header">
        <a href="#/" className="brand">
          Haqq Tilawah <span lang="ar" dir="rtl">حَقَّ تِلَاوَتِهِۦ</span>
        </a>
        <nav>
          <a href="#/" aria-current={section === 'home' ? 'page' : undefined}>
            Home
          </a>
          <a href="#/quran" aria-current={section === 'quran' ? 'page' : undefined}>
            Quran
          </a>
          <a
            href="#/acknowledgements"
            aria-current={section === 'acknowledgements' ? 'page' : undefined}
          >
            Acknowledgements
          </a>
        </nav>
      </header>

      <main>
        {route.page === 'home' && <Home />}
        {route.page === 'quran' && <SurahList />}
        {route.page === 'surah' && <Reader key={route.n} n={route.n} ayah={route.ayah} />}
        {route.page === 'acknowledgements' && <Acknowledgements />}
      </main>

      <footer className="site-footer">
        <p>
          Free and open source under the{' '}
          <a href="https://www.gnu.org/licenses/gpl-3.0.html">GNU GPL v3</a>.
          Quran text from <a href="https://tanzil.net">Tanzil</a>.{' '}
          <a href={REPO_URL}>Source code</a> ·{' '}
          <a href="#/acknowledgements">Acknowledgements</a>
        </p>
      </footer>
    </>
  )
}

export default App
