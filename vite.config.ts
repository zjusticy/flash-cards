import * as path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { configDefaults } from 'vitest/config';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFilesAfterEnv: 'src/setupTests.js',
      exclude: [...configDefaults.exclude, 'tests/excluded/**'],
    },
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
    define: {
      'process.env.FIREBASE_API_KEY': JSON.stringify(env.FIREBASE_API_KEY),
      'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(
        env.FIREBASE_AUTH_DOMAIN
      ),
      'process.env.FIREBASE_DATABASE_URL': JSON.stringify(
        env.FIREBASE_DATABASE_URL
      ),
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(
        env.FIREBASE_PROJECT_ID
      ),
      'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(
        env.FIREBASE_STORAGE_BUCKET
      ),
      'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(
        env.FIREBASE_MESSAGING_SENDER_ID
      ),
      'process.env.FIREBASE_APP_ID': JSON.stringify(env.FIREBASE_APP_ID),
      'process.env.GENERATE_SOURCEMAP': JSON.stringify(env.GENERATE_SOURCEMAP),
      'process.env.MODE': JSON.stringify(env.MODE),
    },
  };
});
