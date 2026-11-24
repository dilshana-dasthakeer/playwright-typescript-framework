import { type Booking, type CreatedBooking } from '../../src/api/types';
import { buildBooking } from '../../src/data/booking';
import { expect, test } from '../../src/fixtures/api';

test.describe('Booking API', () => {
  test('the service is up', { tag: ['@smoke', '@api'] }, async ({ client }) => {
    const response = await client.ping();

    expect(response.status()).toBe(201); // this API answers its health check with 201
  });

  test('rejects bad credentials', { tag: ['@regression', '@api'] }, async ({ client }) => {
    const response = await client.createToken('admin', 'wrong-password');

    // The API returns 200 with a reason instead of 401, so the body is what matters.
    const body = (await response.json()) as { token?: string; reason?: string };
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });

  test('lists bookings with ids', { tag: ['@regression', '@api'] }, async ({ client }) => {
    const response = await client.list();
    expect(response.status()).toBe(200);

    const bookings = (await response.json()) as Array<{ bookingid: number }>;
    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.length).toBeGreaterThan(0);
    expect(typeof bookings[0]?.bookingid).toBe('number');
  });

  test('creates a booking and returns what was sent', { tag: ['@smoke', '@api'] }, async ({ booking }) => {
    expect(booking.bookingid).toBeGreaterThan(0);
    expect(booking.booking).toMatchObject({
      lastname: 'Dasthakeer',
      totalprice: 250,
      depositpaid: true,
      bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    });
  });

  test('a created booking can be read back', { tag: ['@regression', '@api'] }, async ({ client, booking }) => {
    const response = await client.get(booking.bookingid);

    expect(response.status()).toBe(200);
    expect((await response.json()) as Booking).toEqual(booking.booking);
  });

  test('a booking can be updated with a valid token', { tag: ['@regression', '@api'] }, async ({ client, booking, token }) => {
    const changed = buildBooking({ firstname: booking.booking.firstname, totalprice: 999, depositpaid: false });

    const response = await client.update(booking.bookingid, changed, token);
    expect(response.status()).toBe(200);

    const reread = (await (await client.get(booking.bookingid)).json()) as Booking;
    expect(reread.totalprice).toBe(999);
    expect(reread.depositpaid).toBe(false);
  });

  test('updating without a token is forbidden', { tag: ['@regression', '@api'] }, async ({ client, booking }) => {
    const response = await client.update(booking.bookingid, buildBooking());

    expect(response.status()).toBe(403);
  });

  test('a deleted booking is gone', { tag: ['@regression', '@api'] }, async ({ client, token }) => {
    const created = (await (await client.create(buildBooking())).json()) as CreatedBooking;

    const deleted = await client.delete(created.bookingid, token);
    expect(deleted.status()).toBe(201); // this API answers a delete with 201

    const response = await client.get(created.bookingid);
    expect(response.status()).toBe(404);
  });

  test('an unknown booking returns 404', { tag: ['@regression', '@api'] }, async ({ client }) => {
    const response = await client.get(999_999_999);

    expect(response.status()).toBe(404);
  });
});
