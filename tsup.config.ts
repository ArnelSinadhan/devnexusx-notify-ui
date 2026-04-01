import { defineConfig } from 'tsup';

export default defineConfig([
  // Core vanilla JS entry
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    minify: true,
    splitting: false,
    external: ['react', 'react-dom'],
  },
  // React entry — separate chunk for tree-shaking
  {
    entry: { react: 'src/react/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    treeshake: true,
    minify: true,
    splitting: false,
    external: ['react', 'react-dom'],
  },
]);
