import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/config.js'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// After a deploy, a tab still running the old build asks for page chunks that
// no longer exist and would show a blank page. Reload once to get the new
// build; the timestamp stops a loop if the chunk is missing for another reason.
window.addEventListener('vite:preloadError', (event) => {
  const last = Number(sessionStorage.getItem('chunkReloadAt') || 0)
  if (Date.now() - last < 10000) return
  event.preventDefault()
  sessionStorage.setItem('chunkReloadAt', String(Date.now()))
  window.location.reload()
})

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
