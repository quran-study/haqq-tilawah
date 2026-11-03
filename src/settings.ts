import { useEffect, useState } from 'react'

export type Settings = {
  // Ids of the translations to show, e.g. 'en.sahih'
  translations: string[]
  arabicSize: number
}

const KEY = 'haqq-tilawah:settings'
const DEFAULTS: Settings = { translations: ['en.sahih'], arabicSize: 1.75 }

export const ARABIC_SIZES = [1.4, 1.75, 2.1, 2.5]

function read(): Settings {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    // Earlier versions had a single on/off switch for the translation
    if (stored.showTranslation === false && !stored.translations) stored.translations = []
    delete stored.showTranslation
    return { ...DEFAULTS, ...stored }
  } catch {
    return DEFAULTS
  }
}

// Reading preferences, remembered on this device only
export function useSettings() {
  const [settings, setSettings] = useState<Settings>(read)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings))
    } catch {
      // storage unavailable (private mode); settings last for this visit only
    }
  }, [settings])

  return [settings, setSettings] as const
}
