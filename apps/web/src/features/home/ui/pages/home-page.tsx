// Page d'accueil (point d'entrée routé de la feature home).
// L'UI consomme le hook : aucune logique métier ici.
import { useHome } from '../../hooks/use-home'

export function HomePage() {
    const { message, isLoading } = useHome()

    return (
        <main className="p-8">
            <h1 className="text-2xl font-semibold">
                {isLoading ? 'Chargement…' : message}
            </h1>
        </main>
    )
}
