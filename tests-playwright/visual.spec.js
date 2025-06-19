import { expect, test } from '@playwright/test';
import manifest from '../storybook-static/index.json' assert { type: 'json' };
import { navigate } from '../test/helpers/navigate.js';

const options = {
  fullPage: true,
  animations: 'disabled',
};

test.beforeEach(async ({ page }, meta) => {
  /**
   * Set the viewport size and other global level browser settings here.
   * For example you may want to block certain resources to enhance test stability.
   */
  await page.setViewportSize({ width: 1920, height: 1080 });

  await navigate(page, 'https://www.clever-cloud.com/developers/clever-components/', meta.title);
  await page.screenshot({
    path: `tests/visual.spec.ts-snapshots/${meta.title}-upstream-${process.platform}.png`,
    options,
  });
});

const visualStories = Object.values(manifest.entries).filter(
  ({ type, title }) => type === 'story' && title.includes('cc-kv-hash-explorer'),
);

visualStories.forEach((story) => {
  test(story.id, async ({ page }, meta) => {
    await navigate(page, 'http://localhost:6006', meta.title);
    const upstreamScreenshot = `${meta.title}-upstream-${process.platform}.png`;

    const screenshot = await page.screenshot({
      path: `tests/${meta.title}-current-${process.platform}.png`,
      options,
    });

    expect(screenshot).toMatchSnapshot(upstreamScreenshot);
  });
});
