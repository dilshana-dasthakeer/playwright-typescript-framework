import { type APIRequestContext, type APIResponse } from '@playwright/test';
import { type Booking } from './types';

/**
 * Thin client for https://restful-booker.herokuapp.com. Methods return the raw response so each
 * test decides which status and body to assert, including the error cases.
 */
export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  ping(): Promise<APIResponse> {
    return this.request.get('/ping');
  }

  createToken(username: string, password: string): Promise<APIResponse> {
    return this.request.post('/auth', { data: { username, password } });
  }

  list(): Promise<APIResponse> {
    return this.request.get('/booking');
  }

  get(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  create(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  update(id: number, booking: Booking, token?: string): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, { data: booking, headers: authHeader(token) });
  }

  delete(id: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: authHeader(token) });
  }
}

function authHeader(token?: string): Record<string, string> {
  return token ? { Cookie: `token=${token}` } : {};
}
