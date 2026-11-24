import { test as base, expect } from '@playwright/test';
import { BookingClient } from '../api/BookingClient';
import { type Booking, type CreatedBooking } from '../api/types';
import { buildBooking } from '../data/booking';

type ApiFixtures = {
  client: BookingClient;
  /** A valid admin token for the public demo account in the Restful Booker docs. */
  token: string;
  /** A booking created before the test and deleted after it, even when the test fails. */
  booking: CreatedBooking;
};

export const test = base.extend<ApiFixtures>({
  client: async ({ request }, use) => {
    await use(new BookingClient(request));
  },

  token: async ({ client }, use) => {
    const response = await client.createToken('admin', 'password123');
    expect(response.status()).toBe(200);
    const body = (await response.json()) as { token?: string };
    expect(body.token, 'auth response contains a token').toBeTruthy();
    await use(body.token as string);
  },

  booking: async ({ client, token }, use) => {
    const input: Booking = buildBooking();
    const response = await client.create(input);
    expect(response.status()).toBe(200);
    const created = (await response.json()) as CreatedBooking;

    await use(created);

    await client.delete(created.bookingid, token); // clean up; already-deleted is fine
  },
});

export { expect };
