import { describe, test } from 'vitest';
import { addTranslations } from '../../src/lib/i18n/i18n.js';
import * as en from '../../src/translations/translations.en.js';

/**
 * @typedef {import('./test-stories.types.js').RawStoriesModule} RawStoriesModule
 * @typedef {import('./test-stories.types.js').AnnotatedStoryFnClever} AnnotatedStoryFnClever
 * @typedef {import('./test-stories.types.js').ModuleEntryWithStoryFunction} ModuleEntryWithStoryFunction
 * @typedef {import('./test-stories.types.js').ArrayOfStoryFunctions} ArrayOfStoryFunctions
 * @typedef {import('@storybook/web-components').WebComponentsRenderer} WebComponentsRenderer
 * @typedef {import('@storybook/web-components').StoryContext<WebComponentsRenderer>} StoryContext
 */

const viewports = {
  desktop: {
    width: 1200,
    height: 640,
  },
  mobile: {
    width: 360,
    height: 640,
  },
};

/** @type {StoryContext} */
// @ts-ignore we don't need to provide all options because the story won't be displayed in storybook
const storyConf = {
  globals: {
    locale: 'en',
  },
};

// Register languages
addTranslations(en.lang, en.translations);

const IGNORE_PATTERNS_FOR_VISUAL_REGRESSIONS = ['simulation'];

/**
 * Transform the result of an imported module from a story file into an array of story functions that can be used to render every story.
 * The imported module is an object containing every named export (story functions mostly) as well as the default export (metadata about the stories).
 *
 * @param {RawStoriesModule} importedModule the result of a story file import.
 * @returns {ArrayOfStoryFunctions} the story functions. These functions can be used to render each story.
 */
export const getStories = (importedModule) => {
  const filteredStories = /** @type {ArrayOfStoryFunctions} */ (
    Object.entries(importedModule)
      .filter(
        ([_moduleEntryName, moduleEntryValue]) =>
          typeof moduleEntryValue === 'function' && 'component' in moduleEntryValue,
      )
      .map(([storyName, storyFunction]) => {
        const defaultTestsConfig = getDefaultTestsConfig(storyName);
        storyFunction.parameters.tests = mergeTestsConfig(defaultTestsConfig, storyFunction.parameters.tests);

        return { storyName, storyFunction };
      })
  );

  return filteredStories;
};

const mergeTestsConfig = (defaults, custom) => {
  return {
    accessibility: {
      ...defaults.accessibility,
      ...custom?.accessibility,
    },
    visualRegressions: {
      ...defaults.visualRegressions,
      ...custom?.visualRegressions,
    },
  };
};

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

/** @param {RawStoriesModule} storiesModule */
export async function testStories(storiesModule) {
  const componentTag = storiesModule.default.component;
  const stories = getStories(storiesModule);
  const shouldRunTests = stories.some(
    ({ storyFunction }) =>
      storyFunction.parameters.tests.accessibility.enable || storyFunction.parameters.tests.visualRegressions.enable,
  );

  describe('blabal', () => {
    if (shouldRunTests) {
      stories.forEach(({ storyName, storyFunction }) => {
        if (
          storyFunction.parameters.tests.accessibility.enable ||
          storyFunction.parameters.tests.visualRegressions.enable
        ) {
          test(`${componentTag} ${storyName} desktop`, async function () {
            if (storyFunction.parameters.tests.visualRegressions.enable) {
              const storyElement = storyFunction({}, storyConf);
              document.body.replaceChildren(storyElement);
              await storyElement.updateComplete;
            }
          });

          // test(`${componentTag} ${storyName} desktop`, async function () {
          //   if (storyFunction.parameters.tests.visualRegressions.enable) {
          //     it('should have no visual regression', async function () {
          //       await setViewport(viewports.desktop);
          //       const element = await fixture(storyFunction({}, storyConf));

          //       await elementUpdated(element);
          //       await executeServerCommand('wait-for-network-idle');

          //       injectCssIntoAllShadowRoots(element, DISABLE_ANIMATIONS_CSS);
          //       // await executeServerCommand('pause-clock');
          //       await visualDiff(element, `${componentTag}-${storyName}-mobile`);
          //     });
          //   }
          // });
        }
      });
    }
  });
}
