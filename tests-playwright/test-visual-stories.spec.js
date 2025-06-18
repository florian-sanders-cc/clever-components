import { globSync } from 'tinyglobby';
import { testStories } from './test-visual-regressions.js';

const storyModules = globSync('../src/components/cc-input-date/*.stories.js');
console.log(storyModules);

for (const [path, storiesModule] of Object.entries(storyModules)) {
  testStories(storiesModule);
}
