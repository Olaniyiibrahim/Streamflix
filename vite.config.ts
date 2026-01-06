import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite' // <-- MUST HAVE THIS
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- ADD THIS TO THE ARRAY
  ],
})