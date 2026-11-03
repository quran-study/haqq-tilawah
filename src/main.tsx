import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/amiri-quran'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
