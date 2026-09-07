// Logique de la feature home (hook). La logique vit dans hooks/, jamais dans l'UI.
// Exemple minimal illustrant le pattern data-layer : useQuery + Zod validateResponse.
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { apiClient } from '@shared/api/axios'
import { validateResponse } from '@shared/api/validate-response'

// Le schéma Zod est la source de vérité ; le type est INFÉRÉ.
const welcomeSchema = z.object({
    message: z.string(),
})

export type Welcome = z.infer<typeof welcomeSchema>

// Le service renvoie `unknown` ; c'est validateResponse qui garantit le type.
async function fetchWelcome(): Promise<Welcome> {
    const { data } = await apiClient.get<unknown>('/welcome')
    return validateResponse(welcomeSchema, data, 'home.fetchWelcome')
}

export function useHome() {
    // queryKey en TABLEAU ; on expose isLoading (dérivé), pas isPending.
    const query = useQuery({
        queryKey: ['home', 'welcome'],
        queryFn: fetchWelcome,
    })

    return {
        message: query.data?.message ?? 'Bienvenue sur Hello Ednah',
        isLoading: query.isLoading,
        isError: query.isError,
    }
}
