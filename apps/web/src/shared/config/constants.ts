// Constantes transverses (config minimale).
// enableMock : bascule mock-first → vraie API. Piloté par variable d'env Vite.
export const API_BASE_URL = '/api'

export const ENABLE_MOCK = import.meta.env.VITE_ENABLE_MOCK !== 'false'
