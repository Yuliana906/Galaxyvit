import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        registro: resolve(__dirname, 'registro.html'),
        ranking: resolve(__dirname, 'ranking.html'),
        juego: resolve(__dirname, 'juego.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
