import { useEffect, useState } from 'react'
import { loadRoots, rootKey, type Root } from './data.ts'
import { spacedRoot } from './grammar.ts'

type Sort = 'alphabetical' | 'frequency'

function Roots() {
  const [roots, setRoots] = useState<Root[]>()
  const [error, setError] = useState<string>()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('alphabetical')

  useEffect(() => {
    loadRoots()
      .then(setRoots)
      .catch((e: Error) => setError(e.message))
  }, [])

  const q = rootKey(query)
  const shown = roots
    ?.filter((r) => !q || rootKey(r.r).startsWith(q) || r.b.startsWith(query.trim()))
    .sort((a, b) => (sort === 'frequency' ? b.n - a.n : 0))

  return (
    <section>
      <h1>Roots</h1>
      <p>
        Most Quranic words grow from a root of three (sometimes four) letters that carries a core
        meaning. Explore every root in the Quran, the words formed from it, and where each one
        appears.
      </p>
      <div className="list-tools">
        <input
          type="search"
          className="filter"
          placeholder="Type a root, e.g. كتب or ر ح م"
          aria-label="Find a root"
          lang="ar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label>
          Sort{' '}
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="alphabetical">A–Z (Arabic)</option>
            <option value="frequency">Most frequent</option>
          </select>
        </label>
      </div>

      {error && <p className="error">{error}</p>}
      {!roots && !error && <p className="muted">Loading…</p>}
      {shown && (
        <p className="muted">
          {shown.length} of {roots!.length} roots
        </p>
      )}

      <ul className="root-grid">
        {shown?.map((r) => (
          <li key={r.r}>
            <a href={`#/root/${encodeURIComponent(r.r)}`}>
              <span lang="ar" dir="rtl" className="root-letters">
                {spacedRoot(r.r)}
              </span>
              <span className="muted">
                {r.n}× · {r.lemmas.length} {r.lemmas.length === 1 ? 'form' : 'forms'}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Roots
