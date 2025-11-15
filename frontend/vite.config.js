import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Enable polyfills for these modules
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Polyfill specific modules
      include: ['buffer', 'events', 'util', 'stream'],
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  optimizeDeps: {
    exclude: ['snarkjs'],
    include: [
      'circomlibjs',
      'blake2b',
      'buffer',
      'events',
      'util',
      'readable-stream'
    ],
    esbuildOptions: {
      // Fix CommonJS interop for blake2b and other CommonJS modules
      mainFields: ['module', 'main'],
      // Define Node.js globals
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    commonjsOptions: {
      // Transform CommonJS modules to ES modules
      transformMixedEsModules: true,
      // Default export handling - treat module.exports as default
      defaultIsModuleExports: true
    },
    rollupOptions: {
      // Don't externalize these - bundle them
      external: []
    }
  },
  define: {
    // Ensure proper handling of CommonJS modules
    global: 'globalThis',
    // Provide process.env
    'process.env': '{}',
    'process.browser': 'true'
  }
});

