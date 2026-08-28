import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should redirect to /login when accessing /dashboard without auth", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/.*login/);
  });

  test("login page should have email and password fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("should show validation error for invalid email", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("you@example.com").fill("not-an-email");
    await page.locator('input[type="password"]').fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/please enter a valid email/i)).toBeVisible();
  });

  test("signup page should have all fields", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByPlaceholder("Jane Smith")).toBeVisible();
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
  });
});
