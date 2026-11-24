import { invalidLogins, users } from '../../src/data/users';
import { expect, test } from '../../src/fixtures';

// These tests start signed out, instead of using the saved session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('a valid user reaches the products page', { tag: ['@smoke', '@regression'] }, async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  for (const row of invalidLogins) {
    test(`shows an error for ${row.description}`, { tag: '@regression' }, async ({ page, loginPage }) => {
      await loginPage.login(row.username, row.password);

      await expect(loginPage.error).toHaveText(row.error);
      await expect(page).not.toHaveURL(/inventory\.html/);
    });
  }

  test('a signed-in user can log out', { tag: '@regression' }, async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.logout();

    await expect(page).toHaveURL('/');
  });

  test('the products page is protected when signed out', { tag: '@regression' }, async ({ page, loginPage, inventoryPage }) => {
    await inventoryPage.goto();

    await expect(page).toHaveURL('/');
    await expect(loginPage.error).toContainText("You can only access '/inventory.html' when you are logged in");
  });
});
