export function testVisualStoriesPlugin() {
  return {
    name: 'test-story-visual',
    async resolveId(id, importer, options) {
      // console.log(importer);
      // If `.stories.js` is imported with a wtr-session query, rewrite to .stories.test.js
      console.log(id);
      if (id.includes('.stories.js')) {
        return id.replace('.stories.js', '.stories.test.js');
      }
      return null;
    },
    async load(id) {
      // Serve generated test files that import the story modules
      if (id.endsWith('.stories.test.js')) {
        const originalStoriesPath = id.replace('.stories.test.js', '.stories.js');
        const testFileContent = `
          import { testStories } from '/test/helpers/test-visual-regressions.js';
          import * as storiesModule from '${originalStoriesPath}';

          testStories(storiesModule);
        `;
        return testFileContent;
      }
      return null;
    },
  };
}
