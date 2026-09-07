// UI de repli affichée quand un ErrorBoundary attrape un crash de rendu.
// Variante `compact` pour le cas par-route (le reste de l'app reste visible).
import { Button } from './button'

type ErrorFallbackProps = {
    onReset: () => void
    compact?: boolean
}

export function ErrorFallback({ onReset, compact }: ErrorFallbackProps) {
    return (
        <div className={compact ? 'p-6' : 'flex min-h-screen items-center justify-center p-6'}>
            <div className="text-center">
                <h2 className="text-lg font-semibold">Une erreur est survenue</h2>
                <p className="mt-1 text-sm opacity-70">
                    {compact
                        ? 'Cette section a rencontré un problème.'
                        : "L'application a rencontré un problème."}
                </p>
                <Button className="mt-4 border" onClick={onReset}>
                    Réessayer
                </Button>
            </div>
        </div>
    )
}
