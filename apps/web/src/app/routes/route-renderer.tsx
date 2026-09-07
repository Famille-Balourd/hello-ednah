// ErrorBoundary par route : isole les crashs d'une page.
// Keyé par routeKey → naviguer vers une autre route réinitialise le fallback,
// et le header/sidebar restent utilisables si une seule page plante.
import type { ReactNode } from 'react'
import { ErrorBoundary } from '@shared/components/ui/error-boundary'

type RouteRendererProps = {
    routeKey: string
    children: ReactNode
}

export function RouteRenderer({ routeKey, children }: RouteRendererProps) {
    return (
        <ErrorBoundary key={routeKey} compact>
            {children}
        </ErrorBoundary>
    )
}
