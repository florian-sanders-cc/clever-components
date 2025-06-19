import { getStoryUrl } from './get-storybook-url.js';

/**
 * Navigates to a specific Storybook story page.
 * @param {import('@playwright/test').Page} page - The Playwright Page object.
 * @param {string} storybookUrl - The base URL of the Storybook instance.
 * @param {string} id - The story ID to navigate to.
 * @returns {Promise<void>}
 */
export async function navigate(page, storybookUrl, id) {
  try {
    const url = getStoryUrl(storybookUrl, id);
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#storybook-root');
  } catch (error) {
    // Handle error here in cases where the above times out due to 404's and other factors.
  }
}
