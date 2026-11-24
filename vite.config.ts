import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
export default defineConfig(({mode,command,isPreview})=>({
  base: mode!=='vercel' && (command==='build'||isPreview)?'/velocity/':'/',
  plugins: [react(), tailwind()],
}))
