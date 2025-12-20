import './stylesheets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Background from './components/ui/Background'
import Titlebar from './components/ui/Titlebar'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Titlebar />
    <App />
    <Background />
  </StrictMode>
)
