import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import tagger from "@dhiwise/component-tagger";

export default defineConfig({
    build: {
        chunkSizeWarningLimit: 2000,
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
        tagger(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    server: {
        host: 'localhost',
        strictPort: true,
    },
});
