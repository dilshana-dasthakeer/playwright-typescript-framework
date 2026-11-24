import { type Booking } from '../api/types';

/** Builds a valid booking with a unique name, so parallel tests never share data. */
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  const suffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  return {
    firstname: `Dilshana${suffix}`,
    lastname: 'Dasthakeer',
    totalprice: 250,
    depositpaid: true,
    bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
