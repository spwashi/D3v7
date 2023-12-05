import {defineConfig} from 'vite';
import path           from 'path';

export default defineConfig(
  {
    root:      path.resolve(__dirname, 'src'),
    base:      '/',
    publicDir: path.resolve(__dirname, 'public'),
    build:     {
      outDir:      path.resolve(__dirname, '_site'),
      emptyOutDir: true,
      sourcemap:   true,
    },
    server:    {
      host: 'localhost',
      port: 3000,
      open: true,
    },
    plugins:   []
  }
);

