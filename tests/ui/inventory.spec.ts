import { products } from '../../src/data/users';
import { expect, test } from '../../src/fixtures';

test.describe('Products and cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('lists six products', { tag: '@regression' }, async ({ inventoryPage }) => {
    expect(await inventoryPage.productNames()).toHaveLength(6);
  });

  test('sorts by price, low to high', { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.productPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorts by name, Z to A', { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');

    const names = await inventoryPage.productNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('the cart badge follows products added and removed', { tag: ['@smoke', '@regression'] }, async ({ inventoryPage }) => {
    await expect(inventoryPage.cartBadge).toHaveCount(0);

    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bikeLight);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.removeFromCart(products.backpack);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('the cart lists the products that were added', { tag: '@regression' }, async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bikeLight);
    await inventoryPage.openCart();

    await expect(cartPage.itemNames).toHaveText([products.backpack, products.bikeLight]);
  });
});
