import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // scripts/build-blog.mjs reads this to link the correct hashed CSS file
    // from the static blog pages it generates after `vite build` runs.
    manifest: true,
  },
})
