import { defineConfig } from 'vite';
import viteConfig from './vite.config.ts';

export default defineConfig({
  ...viteConfig,
  base: '/notepadjs/beta'
});
