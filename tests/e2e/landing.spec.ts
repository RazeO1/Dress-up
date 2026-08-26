import { test, expect } from '@playwright/test';

test('landing page renders hero and CTAs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/wardrobe/i);
  await expect(page.getByRole('link', { name: /Get started/i }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /I already have an account/i })).toBeVisible();
});
