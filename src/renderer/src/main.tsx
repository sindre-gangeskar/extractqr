import './stylesheets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Background from './components/ui/Background'
import Titlebar from './components/ui/Titlebar'

const isMac = window.electron.process.platform === 'darwin'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {!isMac && <Titlebar />}
    <App />
    <Background />
  </StrictMode>
)
