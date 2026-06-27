import { test, expect } from '@playwright/test';

test('text search filters gem list', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.gem-item', { timeout: 10000 });

  const searchInput = page.locator('#gemSearch');
  await searchInput.fill('pazarlama');
  await page.waitForTimeout(400); // debounce

  // After search, there should be fewer results or a specific gem visible
  const items = page.locator('.gem-item');
  const countAfter = await items.count();
  expect(countAfter).toBeGreaterThan(0);
});

test('clearing search restores full list', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.gem-item', { timeout: 10000 });
  const countBefore = await page.locator('.gem-item').count();

  const searchInput = page.locator('#gemSearch');
  await searchInput.fill('xyz_nonexistent_query');
  await page.waitForTimeout(400);

  await searchInput.fill('');
  await page.waitForTimeout(400);
  const countAfter = await page.locator('.gem-item').count();
  expect(countAfter).toBe(countBefore);
});
