const playwrightScreenshot = async ({ provider, page }) => {
  if (provider.name === 'playwright') {
    const screenshot = await page.screenshot({ animations: 'disabled' });
    // Save the screenshot to the screenshots directory (create if it doesn't exist)
    console.log('screenshotting');
    const fs = await import('fs/promises');
    const path = await import('path');
    const screenshotsDir = path.resolve(process.cwd(), 'screenshots');
    await fs.mkdir(screenshotsDir, { recursive: true });
    const filename = `screenshot-${Date.now()}.png`;
    const filepath = path.join(screenshotsDir, filename);
    await fs.writeFile(filepath, screenshot);
    return { someValue: true };
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
