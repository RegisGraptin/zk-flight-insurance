
let accessToken: string | null = null;
let tokenExpiry: number = 0; // Epoch in ms

export interface AmadeusTokenResponse {
    access_token: string;
    expires_in: number; // The number of seconds until the token expires.
}


// https://developers.amadeus.com/self-service/apis-docs/guides/developer-guides/API-Keys/authorization/
export async function getAccessToken(): Promise<string> {
  const now = Date.now();

  // If token is valid, return it
  if (accessToken && now < tokenExpiry - 60_000) { // 1 min early refresh buffer
    return accessToken;
  }

  console.info('[Amadeus] Fetching new access token...');

  // Otherwise fetch new token
  const res = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: new Headers({ 
        'Content-Type': 'application/x-www-form-urlencoded' 
    }),
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.AMADEUS_API_CLIENT_ID!,
      client_secret: process.env.AMADEUS_API_CLIENT_SECRET!,
    }),
  });

  if (!res.ok) throw new Error('Failed to fetch access token');

  const data: AmadeusTokenResponse = await res.json();

  accessToken = data.access_token;
  tokenExpiry = now + data.expires_in * 1000; // convert to ms

  return accessToken;
}
