import { expect, test as setup } from '@playwright/test';
import { users } from '../src/data/users';
import { LoginPage } from '../src/pages/LoginPage';

const STORAGE_STATE = 'playwright/.auth/standard-user.json';

// The tags keep this step from being filtered out by --grep @smoke or --grep @regression.
setup('sign in once and save the session', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(users.standard.username, users.standard.password);

  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: STORAGE_STATE });
});
