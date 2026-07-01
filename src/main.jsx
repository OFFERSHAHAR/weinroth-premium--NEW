import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes.jsx'
import './App.css'

export const createRoot = ViteReactSSG(
  { routes },
  ({ isClient }) => {
    // Register the service worker so the site is installable / full-screen on mobile.
    if (isClient && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {})
      })
    }
  }
)
