import { beforeAll, vi } from 'vitest';
import { testStories } from './helpers/test-visual-regressions.js';

// Set up fake timers and a fixed date BEFORE importing anything else
beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2020-01-01T00:00:00.000Z'));
});
// Find all .stories.js files in your source directory
const storyModules = import.meta.glob('../src/components/cc-logs-app-access/*.stories.js', { eager: true });
console.log(storyModules);

for (const [path, storiesModule] of Object.entries(storyModules)) {
  testStories(storiesModule);
}
