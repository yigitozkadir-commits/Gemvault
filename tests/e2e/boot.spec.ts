import { test, expect } from '@playwright/test';

test('app boots and shows 735 gems stat', async ({ page }) => {
  await page.goto('/');
  // Wait for hero stat to appear
  await expect(page.locator('.stat-num').first()).toBeVisible({ timeout: 10000 });
  const statText = await page.locator('.hero-corner').textContent();
  expect(statText?.trim()).toBe('735');
});

test('18 category buttons are visible', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.cat-btn', { timeout: 10000 });
  const cats = page.locator('.cat-btn');
  // At least 18 (plus "Tümü/All")
  const count = await cats.count();
  expect(count).toBeGreaterThanOrEqual(18);
});

test('gem list renders items', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.gem-item', { timeout: 10000 });
  const gems = page.locator('.gem-item');
  const count = await gems.count();
  expect(count).toBeGreaterThan(0);
});
