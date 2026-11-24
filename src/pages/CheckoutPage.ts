import { type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  readonly error: Locator;
  readonly confirmation: Locator;
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly postalCode: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly itemPrices: Locator;
  private readonly subtotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;

  constructor(page: Page) {
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.error = page.getByTestId('error');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.confirmation = page.getByTestId('complete-header');
  }

  async fillForm(first: string, last: string, zip: string): Promise<void> {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(zip);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async itemPriceValues(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map(CheckoutPage.money);
  }

  async subtotal(): Promise<number> {
    return CheckoutPage.money(await this.subtotalLabel.innerText());
  }

  async tax(): Promise<number> {
    return CheckoutPage.money(await this.taxLabel.innerText());
  }

  async total(): Promise<number> {
    return CheckoutPage.money(await this.totalLabel.innerText());
  }

  private static money(text: string): number {
    return Number(text.replace(/[^0-9.]/g, ''));
  }
}
