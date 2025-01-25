import { defineConfig } from 'vite';
import viteConfig from './vite.config.ts';

export default defineConfig({
  ...viteConfig,
  define: {
    IS_BETA: 1,
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  base: '/notepadjs/beta'
});
