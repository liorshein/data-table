import '@/index.css';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { BrowserRouter } from 'react-router'
import App from '@/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NuqsAdapter >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NuqsAdapter>
  </StrictMode>,
)
