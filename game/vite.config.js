import { defineConfig } from 'vite';

// Configuración mínima para soportar múltiples páginas HTML con Vite.
export default defineConfig({
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        registro: 'registro.html',
        ranking: 'ranking.html',
        juego: 'juego.html',
      },
    },
  },
});
