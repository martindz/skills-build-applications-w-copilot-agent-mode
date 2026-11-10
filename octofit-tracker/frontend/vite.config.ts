import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const codespaceName = env.REACT_APP_CODESPACE_NAME ?? env.CODESPACE_NAME ?? '';

  return {
    plugins: [react()],
    define: {
      'import.meta.env.REACT_APP_CODESPACE_NAME': JSON.stringify(codespaceName),
    },
    // Locally, forward /api to Django; Codespaces uses its HTTPS port URL.
    server: { port: 5173, proxy: { '/api': 'http://localhost:8000' } },
    test: { environment: 'jsdom' },
  };
});
