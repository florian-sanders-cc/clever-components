import { testVisualStoriesPlugin } from './wds/test-visual-stories-plugin.js';

export default {
  optimizeDeps: {
    exclude: ['@web/test-runner-mocha'],
  },
  plugin: [testVisualStoriesPlugin()],
};
