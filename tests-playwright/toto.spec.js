import { expect, test } from '@playwright/test';

console.log(process.env.stories);
test('example test', async ({ page }) => {
  await page.setContent(`
    <html>
      <body>
        <div id="root">Hello world</div>
        <script type="module">
          // You may need to import your component module here if needed
          // Example:
          // import '../../src/components/my-component.js';
        </script>
      </body>
    </html>
  `);
  await expect(page).toHaveScreenshot();
});
