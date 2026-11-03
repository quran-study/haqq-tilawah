import { useEffect, useState } from 'react'

export type Settings = {
  showTranslation: boolean
  arabicSize: number
}

const KEY = 'haqq-tilawah:settings'
const DEFAULTS: Settings = { showTranslation: true, arabicSize: 1.75 }

export const ARABIC_SIZES = [1.4, 1.75, 2.1, 2.5]

function read(): Settings {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }
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
