// Instance axios partagée. Les intercepteurs (auth, erreurs) se branchent ici.
// Le service renvoie `unknown` : c'est le schéma Zod qui garantit le type côté feature.
import axios from 'axios'
import { API_BASE_URL } from '@shared/config/constants'

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
})
