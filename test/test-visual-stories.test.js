import { testStories } from './helpers/test-visual-regressions.js';

const storyModules = import.meta.glob('../src/components/cc-input-date/*.stories.js', { eager: true });

for (const [path, storiesModule] of Object.entries(storyModules)) {
  testStories(storiesModule);
}
