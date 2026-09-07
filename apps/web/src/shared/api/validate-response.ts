// Validation runtime des réponses API via Zod (safeParse).
// Une réponse non conforme → log + erreur explicite, JAMAIS un crash.
// La validation se fait côté feature (le service, lui, renvoie `unknown`).
import type { z } from 'zod'

export function validateResponse<Schema extends z.ZodType>(
    schema: Schema,
    data: unknown,
    context: string,
): z.infer<Schema> {
    const result = schema.safeParse(data)

    if (!result.success) {
        // On centralise le log ; brancher ici le monitoring si besoin.
        console.error(`[validateResponse] Réponse invalide (${context})`, result.error.issues)
        throw new Error(`Réponse API invalide : ${context}`)
    }

    return result.data
}
