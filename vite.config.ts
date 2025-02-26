import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  base: "/NewsOra/",  
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
