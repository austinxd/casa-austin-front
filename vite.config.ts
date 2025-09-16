import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    server: {
        port: 5000,
        host: '0.0.0.0',
        strictPort: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    plugins: [react()],
    build: { 
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    mui: ['@mui/material', '@mui/icons-material'],
                    redux: ['@reduxjs/toolkit', 'react-redux'],
                    calendar: ['@fullcalendar/react', '@fullcalendar/core', '@fullcalendar/daygrid'],
                    charts: ['apexcharts', 'react-apexcharts'],
                    router: ['react-router-dom'],
                }
            }
        }
    },
    optimizeDeps: {
        include: ['@mui/material', '@mui/icons-material', 'react', 'react-dom']
    }
})
