import { expect, test } from '@playwright/test';
import { addTranslations } from '../src/lib/i18n/i18n.js';
import * as en from '../src/translations/translations.en.js';

/**
 * @typedef {import('./test-stories.types.js').RawStoriesModule} RawStoriesModule
 * @typedef {import('./test-stories.types.js').AnnotatedStoryFnClever} AnnotatedStoryFnClever
 * @typedef {import('./test-stories.types.js').ModuleEntryWithStoryFunction} ModuleEntryWithStoryFunction
 * @typedef {import('./test-stories.types.js').ArrayOfStoryFunctions} ArrayOfStoryFunctions
 * @typedef {import('@storybook/web-components').WebComponentsRenderer} WebComponentsRenderer
 * @typedef {import('@storybook/web-components').StoryContext<WebComponentsRenderer>} StoryContext
 */

const viewports = {
  desktop: { width: 1200, height: 640 },
  mobile: { width: 360, height: 640 },
};

const IGNORE_PATTERNS_FOR_VISUAL_REGRESSIONS = ['simulation'];

const getDefaultTestsConfig = (storyName) => ({
  accessibility: {
    enable: !storyName.toLowerCase().includes('simulation'),
  },
  visualRegressions: {
    enable: !IGNORE_PATTERNS_FOR_VISUAL_REGRESSIONS.some((ignorePattern) =>
      storyName.toLowerCase().includes(ignorePattern),
    ),
  },
});

const mergeTestsConfig = (defaults, custom) => ({
  accessibility: {
    ...defaults.accessibility,
    ...custom?.accessibility,
  },
  visualRegressions: {
    ...defaults.visualRegressions,
    ...custom?.visualRegressions,
  },
});

export const getStories = (importedModule) => {
  return Object.entries(importedModule)
    .filter(
      ([_moduleEntryName, moduleEntryValue]) =>
        typeof moduleEntryValue === 'function' && 'component' in moduleEntryValue,
    )
    .map(([storyName, storyFunction]) => {
      const defaultTestsConfig = getDefaultTestsConfig(storyName);
      storyFunction.parameters.tests = mergeTestsConfig(defaultTestsConfig, storyFunction.parameters.tests);
      return { storyName, storyFunction };
    });
};

// Register translations in Node context if needed
addTranslations(en.lang, en.translations);

/**
 * @param {RawStoriesModule} storiesModule
 */
export async function testStories(storiesModule) {
  const componentTag = storiesModule.default.component;
  const stories = getStories(storiesModule);

  test.describe(`${componentTag} visual regressions`, () => {
    for (const { storyName, storyFunction } of stories) {
      if (storyFunction.parameters.tests.visualRegressions.enable) {
        test(`${componentTag} ${storyName} desktop`, async ({ page }) => {
          await page.setViewportSize(viewports.desktop);

          console.log('YOOOO');
          // Serialize the story function and any needed context
          const storyFnString = storyFunction.toString();
          const storyConf = { globals: { locale: 'en' } };

          // Set up a blank page and inject the component and story
          await page.setContent(`
            <html>
              <body>
                <div id="root"></div>
                <script type="module">
                  // You may need to import your component module here if needed
                  // Example:
                  // import '../../src/components/my-component.js';
                </script>
              </body>
            </html>
          `);

          // Evaluate in browser context: create the story element and append to #root
          await page.evaluate(
            ([storyFnString, storyConf]) => {
              // eslint-disable-next-line no-eval
              const storyFn = eval('(' + storyFnString + ')');
              const element = storyFn({}, storyConf);
              document.getElementById('root').appendChild(element);
            },
            [storyFnString, storyConf],
          );

          // Wait for the component to render (customize as needed)
          await page.waitForSelector(componentTag);

          // Take a screenshot for visual regression
          const element = await page.$(componentTag);
          expect(await element.screenshot()).toMatchSnapshot(`${componentTag}-${storyName}-desktop.png`);
        });
      }
    }
  });
}
