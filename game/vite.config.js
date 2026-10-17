import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        juego: resolve(__dirname, 'juego.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
