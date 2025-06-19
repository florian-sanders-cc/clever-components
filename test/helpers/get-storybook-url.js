/**
 * Constructs a Storybook story URL for a given story ID.
 *
 * @param {string} storybookUrl - The base URL of the Storybook instance.
 * @param {string} id - The ID of the story to display.
 * @returns {string} The full URL to the story's iframe.
 */
export function getStoryUrl(storybookUrl, id) {
  const params = new URLSearchParams({
    id,
    viewMode: 'story',
    nav: '0',
  });

  return `${storybookUrl}/iframe.html?${params.toString()}`;
}
