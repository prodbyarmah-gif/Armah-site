// An HTTP 200 (for example an HTML SPA fallback) is not submission confirmation.
export async function bookingWasAccepted(response: Response): Promise<boolean> {
  if (!response.ok) return false;
  const data: unknown = await response.json().catch(() => null);
  return typeof data === 'object' && data !== null && 'ok' in data && data.ok === true;
}
