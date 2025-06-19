import { chromium } from 'playwright/test';
import { globSync } from 'tinyglobby';

/** @param {import('@playwright/test').FullConfig} config */
async function globalSetup(config) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  try {
    await context.tracing.start({ screenshots: true, snapshots: true });
    console.log('SETTING UP');
    process.env.stories = globSync('src/**/components/*.stories.js');
  } catch (error) {
    await context.tracing.stop({
      path: './test-results/failed-setup-trace.zip',
    });
    await browser.close();
    throw error;
  }
}

export default globalSetup;
