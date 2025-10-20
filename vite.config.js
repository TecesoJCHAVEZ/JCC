import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Usar la ruta completa que incluye /JCC/
  base: '/JCC/dist/', 
  plugins: [react()],
})