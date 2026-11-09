import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react({
            compiler: true,
        }),
        visualizer({
            filename: 'stats.html',
            emitFile: true,
            template: 'treemap',
            gzipSize: true, // show gzip size per module
            brotliSize: true, // show brotli size per module
            open: true, // auto-opens stats.html in browser after build
        }),
    ],
    build: {
        rollupOptions: {
            output: {
                // Split only always-eager libs (React, Query) into cacheable chunks. MUI is
                // left unbucketed on purpose: one eager MUI chunk would pull the grid/form's
                // MUI out of their lazy chunks into the initial load.
                manualChunks(id) {
                    if (!id.includes('node_modules')) return;
                    if (id.includes('@tanstack/react-query')) return 'vendor-query';
                    if (
                        id.includes('/react-dom/') ||
                        id.includes('/react/') ||
                        id.includes('/scheduler/')
                    ) {
                        return 'vendor-react';
                    }
                },
            },
        },
    },
    test: {
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
});
