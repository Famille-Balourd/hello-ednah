// Config ESLint (flat config) du backend Fastify.
// Aligne le lint de l'API sur celui du front (@eslint/js + typescript-eslint).
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    { ignores: ['dist', 'node_modules'] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
)
