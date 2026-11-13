import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' para que funcione en cualquier carpeta de Hostinger (public_html o subcarpeta)
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});
