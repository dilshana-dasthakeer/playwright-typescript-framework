import { type Locator, type Page } from '@playwright/test';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly title: Locator;
  readonly cartBadge: Locator;
  private readonly items: Locator;
  private readonly names: Locator;
  private readonly prices: Locator;
  private readonly sort: Locator;
  private readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.items = page.getByTestId('inventory-item');
    this.names = page.getByTestId('inventory-item-name');
    this.prices = page.getByTestId('inventory-item-price');
    this.sort = page.getByTestId('product-sort-container');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  /**
   * The add and remove buttons share one slot per product, so one method covers both.
   * The product image and title are links with role=button, so the name is matched exactly.
   */
  private productButton(productName: string): Locator {
    return this.items
      .filter({ hasText: productName })
      .getByRole('button', { name: /^(Add to cart|Remove)$/ });
  }

  async addToCart(productName: string): Promise<void> {
    await this.productButton(productName).click();
  }

  async removeFromCart(productName: string): Promise<void> {
    await this.productButton(productName).click();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sort.selectOption(option);
  }

  async productNames(): Promise<string[]> {
    return this.names.allTextContents();
  }

  async productPrices(): Promise<number[]> {
    const texts = await this.prices.allTextContents();
    return texts.map((t) => Number(t.replace('$', '')));
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
    await this.page.getByTestId('logout-sidebar-link').click();
  }
}
