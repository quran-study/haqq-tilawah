import { useEffect, useState } from 'react'
import Acknowledgements from './Acknowledgements.tsx'
import { REPO_URL } from './config.ts'
import Home from './Home.tsx'

type Page = 'home' | 'acknowledgements'

function pageFromHash(): Page {
  return window.location.hash === '#/acknowledgements' ? 'acknowledgements' : 'home'
}

function App() {
  const [page, setPage] = useState<Page>(pageFromHash)

  useEffect(() => {
    const onHashChange = () => {
      setPage(pageFromHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <>
      <header className="site-header">
        <a href="#/" className="brand">
          Haqq Tilawah <span lang="ar" dir="rtl">حَقَّ تِلَاوَتِهِۦ</span>
        </a>
        <nav>
          <a href="#/" aria-current={page === 'home' ? 'page' : undefined}>
            Home
          </a>
          <a
            href="#/acknowledgements"
            aria-current={page === 'acknowledgements' ? 'page' : undefined}
          >
            Acknowledgements
          </a>
        </nav>
      </header>

      <main>{page === 'home' ? <Home /> : <Acknowledgements />}</main>

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
