import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
async function request<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`/api/${path}`,{ method: 'POST',credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json','X-Luxia-Request': '1' }, body: JSON.stringify(body) });
  if (!response.ok) throw new Error('Device verification failed');
  return response.json() as Promise<T>;
}
export async function register(displayName: string) {
  const { options } = await request<{ options: Parameters<typeof startRegistration>[0]['optionsJSON'] }>('webauthn/register/options',{ displayName });
  const response = await startRegistration({ optionsJSON: options });
  const result = await request<{ verified: boolean }>('webauthn/register/verify',response);
  if (result.verified !== true) throw new Error('Device verification failed');
  return result;
}
export async function authenticate() {
  const { options } = await request<{ options: Parameters<typeof startAuthentication>[0]['optionsJSON'] }>('webauthn/auth/options',{});
  const response = await startAuthentication({ optionsJSON: options });
  const result = await request<{ verified: boolean }>('webauthn/auth/verify',response);
  if (result.verified !== true) throw new Error('Device verification failed');
  return result;
}
