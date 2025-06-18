import { defineConfig } from 'vitest/config';
import generateCem from './cem/generate-cem-vite-plugin.js';

export default defineConfig({
  test: {
    include: ['**/test-visual-stories.test.js'],
    browser: {
      provider: 'playwright',
      enabled: true,
      instances: [{ browser: 'chromium' }],
      headless: false,
    },
    setupFiles: './test/setup-mock-date.js',
  },
  resolve: {
    alias: [
      {
        // Without this, vite resolves our imports to the actual `custom-elements.json` file
        // inside the `dist` folder.
        // We need to rely on a virtual file in dev mode, see the `generateCem` plugin for more info.
        find: /.*\/dist\/custom-elements\.json$/,
        replacement: 'virtual:custom-elements.json',
      },
    ],
  },
  plugins: [generateCem()],
});
