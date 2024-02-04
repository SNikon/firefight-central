import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FullViewPanel } from '.'
import '../style.css'

const root = createRoot(document.getElementById('root')!)
root.render(<StrictMode><FullViewPanel /></StrictMode>)
