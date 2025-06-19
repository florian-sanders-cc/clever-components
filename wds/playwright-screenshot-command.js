import { expect, test } from '@playwright/test';

const playwrightScreenshot = async ({ provider, page }) => {
  if (provider.name === 'playwright') {
    test('toto', async () => {
      await expect(page).toHaveScreenshot();

      console.log('screenshotting');

      return { someValue: true };
    });
    // Save the screenshot to the screenshots directory (create if it doesn't exist)
    // const fs = await import('fs/promises');
    // const path = await import('path');
    // const screenshotsDir = path.resolve(process.cwd(), 'screenshots');
    // await fs.mkdir(screenshotsDir, { recursive: true });
    // const filename = `screenshot-${Date.now()}.png`;
    // const filepath = path.join(screenshotsDir, filename);
    // await fs.writeFile(filepath, screenshot);
  }

  throw new Error(`provider ${provider.name} is not supported`);
};

export default function BrowserCommands() {
  return {
    name: 'vitest:custom-commands',
    config() {
      return {
        test: {
          browser: {
            commands: {
              playwrightScreenshot: playwrightScreenshot,
            },
          },
        },
      };
    },
  };
}
