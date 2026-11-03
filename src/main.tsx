import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/amiri-quran'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

// Reloads the page once a new version has been downloaded, so nobody is left on an old copy
registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
