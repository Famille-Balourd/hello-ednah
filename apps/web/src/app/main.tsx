// Point d'entrée : monte l'application dans le DOM.
// Compose les providers globaux (React Query) autour du routeur.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { QueryProvider } from './providers/query-provider'
import { ErrorBoundary } from '@shared/components/ui/error-boundary'
import { router } from './routes/router'
import './styles.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Élément racine #root introuvable')

createRoot(rootElement).render(
    <StrictMode>
        {/* ErrorBoundary racine : un crash de rendu ne fait pas tomber toute l'app */}
        <ErrorBoundary>
            <QueryProvider>
                <RouterProvider router={router} />
            </QueryProvider>
        </ErrorBoundary>
    </StrictMode>,
)
