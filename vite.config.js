import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // *** Línea CRUCIAL añadida para GitHub Pages ***
  base: './', 
  plugins: [react()],
})