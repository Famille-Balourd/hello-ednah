// Configuration Vite standard (plugin React + Tailwind v4).
// On reste sur `vite` + pnpm pour un template fiable en CI/Docker.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

const resolve = (path: string) =>
    fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        // Aliases FSD — doivent rester synchronisés avec tsconfig.json
        alias: {
            '@app': resolve('./src/app'),
            '@features': resolve('./src/features'),
            '@entities': resolve('./src/entities'),
            '@shared': resolve('./src/shared'),
            '@': resolve('./src'),
        },
    },
    server: {
        // Proxy dev : le front tape /api, redirigé vers le backend Fastify
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
    build: {
        // Le backend Fastify sert apps/web/dist en prod (ne pas changer)
        outDir: 'dist',
    },
})
