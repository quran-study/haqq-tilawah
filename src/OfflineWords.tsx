import { useState } from 'react'

const TOTAL = 114

// Fetches every surah's word data so the service worker caches it for offline use
function OfflineWords() {
  const [done, setDone] = useState<number>()
  const [error, setError] = useState<string>()

  if (!('serviceWorker' in navigator)) return null

  const save = async () => {
    setError(undefined)
    setDone(0)
    try {
      for (let n = 1; n <= TOTAL; n++) {
        const r = await fetch(`${import.meta.env.BASE_URL}data/words/${n}.json`)
        if (!r.ok) throw new Error(`surah ${n} (${r.status})`)
        await r.arrayBuffer()
        setDone(n)
      }
    } catch (e) {
      setError(`Could not save everything: ${(e as Error).message}. Please try again when online.`)
    }
  }

  return (
    <p className="offline">
      The Quran text and translation already work offline. Word-by-word grammar is saved as you
      open each surah.
      {done === undefined && (
        <button type="button" className="more" onClick={save}>
          Save all word data now (about 1 MB to download)
        </button>
      )}
      {done !== undefined && done < TOTAL && !error && <strong> Saving… {done} of {TOTAL} surahs</strong>}
      {done === TOTAL && <strong> All word data is saved for offline use.</strong>}
      {error && <span className="error"> {error}</span>}
    </p>
  )
}

export default OfflineWords
