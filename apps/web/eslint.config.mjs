// Config ESLint (flat config). Remplace oxlint de Novaris par eslint standard.
// La règle clé du projet : max-lines à 200 sur src/features/**.
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    { ignores: ['dist', 'node_modules'] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        // Règle des 200 lignes — on compte le code réel (ni blancs ni commentaires)
        files: ['src/features/**/*.{ts,tsx}'],
        rules: {
            'max-lines': [
                'error',
                { max: 200, skipBlankLines: true, skipComments: true },
            ],
        },
    },
)
