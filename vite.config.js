import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // Project root directory (where index.html is located)
  root: path.resolve(__dirname, 'src'),

  // Base public path when served in development or production
  base: '/',

  // Build-specific options
  build: {
    // Output directory for build files
    outDir: path.resolve(__dirname, 'dist'),
    
    // Generate sourcemaps
    sourcemap: true,
  },

  // Development server options
  server: {
    // Server host
    host: 'localhost',

    // Server port
    port: 3000,

    // Open browser on server start
    open: true,
  },

  // Plugins to be used by Vite
  plugins: []
});

