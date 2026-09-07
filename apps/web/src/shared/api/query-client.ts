// QueryClient partagé. QueryCache.onError centralise le log des requêtes en échec.
import { QueryClient, QueryCache } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error, query) => {
            // Log central des erreurs de requête ; brancher ici le monitoring.
            console.error('[query] échec de requête', query.queryKey, error)
        },
    }),
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 30_000,
            refetchOnWindowFocus: false,
        },
    },
})
