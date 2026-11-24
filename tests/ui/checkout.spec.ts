import { checkoutErrors, products } from '../../src/data/users';
import { expect, test } from '../../src/fixtures';

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.onesie);
    await inventoryPage.openCart();
    await cartPage.checkout();
  });

  test('a user can buy two products end to end', { tag: ['@smoke', '@regression'] }, async ({ checkoutPage }) => {
    await checkoutPage.fillForm('Dilshana', 'Dasthakeer', '20000');
    await checkoutPage.continue();
    await checkoutPage.finish();

    await expect(checkoutPage.confirmation).toHaveText('Thank you for your order!');
  });

  test('the subtotal is the sum of the item prices', { tag: '@regression' }, async ({ checkoutPage }) => {
    await checkoutPage.fillForm('Dilshana', 'Dasthakeer', '20000');
    await checkoutPage.continue();

    const sum = (await checkoutPage.itemPriceValues()).reduce((a, b) => a + b, 0);
    expect(await checkoutPage.subtotal()).toBeCloseTo(sum, 2);
  });

  test('the total is the subtotal plus tax', { tag: '@regression' }, async ({ checkoutPage }) => {
    await checkoutPage.fillForm('Dilshana', 'Dasthakeer', '20000');
    await checkoutPage.continue();

    const expected = (await checkoutPage.subtotal()) + (await checkoutPage.tax());
    expect(await checkoutPage.total()).toBeCloseTo(expected, 2);
  });

  for (const row of checkoutErrors) {
    test(`shows an error for ${row.description}`, { tag: '@regression' }, async ({ checkoutPage }) => {
      await checkoutPage.fillForm(row.first, row.last, row.zip);
      await checkoutPage.continue();

      await expect(checkoutPage.error).toHaveText(row.error);
    });
  }
});
