import { test, expect } from '@playwright/test';

test('favorites tab is visible', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.sidebar-tabs, [data-tab]', { timeout: 10000 });

  // Look for favorites tab button
  const favTab = page.locator('[data-tab="favorites"], .tab-btn').filter({ hasText: /favoriler|favorites/i });
  await expect(favTab.first()).toBeVisible();
});
