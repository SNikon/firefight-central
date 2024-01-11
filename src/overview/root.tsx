import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Overview } from '.'
import '../style.css'

const root = createRoot(document.getElementById('root')!)
root.render(<StrictMode><Overview /></StrictMode>)
