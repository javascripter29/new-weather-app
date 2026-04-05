import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AppProviders } from './providers/AppProviders/AppProviders.jsx'
import 'antd/dist/reset.css'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
