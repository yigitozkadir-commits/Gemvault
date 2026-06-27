import { test, expect } from '@playwright/test';

test('clicking a gem shows detail panel', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.gem-item', { timeout: 10000 });

  // Click the first gem
  await page.locator('.gem-item').first().click();

  // Detail panel should appear
  await expect(page.locator('.gem-detail, #gemDetail')).toBeVisible({ timeout: 5000 });
});
