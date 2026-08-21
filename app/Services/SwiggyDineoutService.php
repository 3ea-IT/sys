<?php

namespace App\Services;

use App\Models\SwiggyDineoutToken;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Laravel port of the Node.js "swiggy" CLI client (auth.js + swiggyClient.js).
 *
 * Handles OAuth 2.1 PKCE authentication against the Swiggy MCP server and
 * exposes the Dineout tools (search, restaurant details, slots, booking)
 * as plain PHP methods that the DiningController / admin controllers can call.
 *
 * The original Node client persisted the token to tokens.json and ran a
 * local HTTP server on :3000 to catch the OAuth redirect. In a web app we
 * instead:
 *   - keep the PKCE code_verifier + state in the session between the
 *     "connect" redirect and the "callback" request, and
 *   - persist the resulting access token in the swiggy_dineout_tokens table
 *     (see SwiggyDineoutToken) instead of a local file.
 */
class SwiggyDineoutService
{
    private string $baseUrl;
    private string $scope;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('services.swiggy.base_url', 'https://mcp.swiggy.com'), '/');
        $this->scope = config('services.swiggy.scope', 'mcp:tools mcp:resources mcp:prompts');
    }

    /**
     * Generate a PKCE code_verifier / code_challenge pair (RFC 7636).
     */
    public function generatePkce(): array
    {
        $verifier = rtrim(strtr(base64_encode(random_bytes(32)), '+/', '-_'), '=');
        $challenge = rtrim(strtr(base64_encode(hash('sha256', $verifier, true)), '+/', '-_'), '=');

        return [
            'code_verifier' => $verifier,
            'code_challenge' => $challenge,
        ];
    }

    /**
     * Register a dynamic client with the Swiggy OAuth server (RFC 7591).
     * Falls back to the standard "swiggy-mcp" client id if DCR fails,
     * matching the Node client's behaviour.
     */
    public function registerClient(string $redirectUri): string
    {
        try {
            $response = Http::acceptJson()
                ->post("{$this->baseUrl}/auth/register", [
                    'client_name' => 'Secure My Seat - Dineout Integration',
                    'redirect_uris' => [$redirectUri],
                ]);

            if ($response->failed()) {
                throw new \RuntimeException("DCR failed ({$response->status()}): {$response->body()}");
            }

            return $response->json('client_id') ?: 'swiggy-mcp';
        } catch (\Throwable $e) {
            Log::warning('Swiggy DCR fallback to standard client id', ['error' => $e->getMessage()]);
            return 'swiggy-mcp';
        }
    }

    /**
     * Build the Swiggy authorize URL for the OAuth 2.1 PKCE flow.
     * Returns the URL plus the state/verifier the caller must stash
     * (in session) until the callback arrives.
     */
    public function buildAuthorizeUrl(string $redirectUri): array
    {
        $clientId = $this->registerClient($redirectUri);
        $pkce = $this->generatePkce();
        $state = Str::random(32);

        $query = http_build_query([
            'response_type' => 'code',
            'client_id' => $clientId,
            'redirect_uri' => $redirectUri,
            'code_challenge' => $pkce['code_challenge'],
            'code_challenge_method' => 'S256',
            'state' => $state,
            'scope' => $this->scope,
            // Do not silently reuse another Swiggy session in this browser.
            'prompt' => 'login',
        ]);

        return [
            'url' => "{$this->baseUrl}/auth/authorize?{$query}",
            'client_id' => $clientId,
            'code_verifier' => $pkce['code_verifier'],
            'state' => $state,
        ];
    }

    /**
     * Exchange an authorization code for an access token and persist it.
     */
    public function exchangeCodeForToken(string $code, string $codeVerifier, string $redirectUri, string $clientId, ?int $userId = null): SwiggyDineoutToken
    {
        $response = Http::acceptJson()
            ->post("{$this->baseUrl}/auth/token", [
                'grant_type' => 'authorization_code',
                'code' => $code,
                'code_verifier' => $codeVerifier,
                'redirect_uri' => $redirectUri,
                'client_id' => $clientId,
            ]);

        if ($response->failed()) {
            throw new \RuntimeException("Token exchange failed ({$response->status()}): {$response->body()}");
        }

        return $this->saveToken($response->json(), $clientId, $userId);
    }

    /**
     * Persist the token payload returned by Swiggy, replacing any
     * previously stored token for this user (or the system-wide one).
     */
    private function saveToken(array $tokenData, ?string $clientId = null, ?int $userId = null): SwiggyDineoutToken
    {
        $expiresIn = $tokenData['expires_in'] ?? 432000; // ~5 days, same default as Node client

        return SwiggyDineoutToken::updateOrCreate(
            ['user_id' => $userId],
            [
                'client_id' => $clientId,
                'access_token' => $tokenData['access_token'],
                'token_type' => $tokenData['token_type'] ?? 'Bearer',
                'scope' => $tokenData['scope'] ?? $this->scope,
                'expires_in' => $expiresIn,
                'obtained_at' => now(),
                'expires_at' => now()->addSeconds($expiresIn),
            ]
        );
    }

    /**
     * Fetch the currently stored token for a user (or the system-wide
     * token when $userId is null).
     */
    public function getStoredToken(?int $userId = null): ?SwiggyDineoutToken
    {
        return SwiggyDineoutToken::where('user_id', $userId)->first();
    }

    /**
     * Get a valid access token, or null if re-authentication is required.
     * Unlike the CLI, we can't pop open a browser mid-request — the
     * caller (controller) should redirect the admin to connect() when
     * this returns null.
     */
    public function getValidToken(?int $userId = null): ?string
    {
        $token = $this->getStoredToken($userId);

        if ($token && $token->isValid()) {
            return $token->access_token;
        }

        return null;
    }

    /**
     * Low-level authenticated call to the Swiggy MCP server.
     * Throws a 401 exception (via response()->throw equivalent) that the
     * caller/controller can catch to trigger re-authentication.
     */
    public function callSwiggyApi(string $path, array $body, ?int $userId = null)
    {
        $token = $this->getValidToken($userId);

        if (!$token) {
            throw new SwiggyReauthRequiredException('No valid Swiggy Dineout token. Please reconnect.');
        }

        $url = str_starts_with($path, 'http')
            ? $path
            : $this->baseUrl . '/' . ltrim($path, '/');

        $response = Http::withHeaders([
                'Accept' => 'application/json, text/event-stream',
                'Authorization' => "Bearer {$token}",
            ])
            ->acceptJson()
            ->post($url, $body);

        if ($response->status() === 401) {
            if ($userId !== null) {
                SwiggyDineoutToken::where('user_id', $userId)->delete();
            }

            throw new SwiggyReauthRequiredException('Swiggy Dineout token was rejected (401). Please reconnect.');
        }

        $responseData = $response->json();
        $responseError = '';

        if (is_array($responseData)) {
            $errorValue = $responseData['error'] ?? $responseData['message'] ?? '';
            $responseError = strtolower(is_scalar($errorValue) ? (string) $errorValue : json_encode($errorValue));
        }

        if (str_contains($responseError, 'unauthenticated') || str_contains($responseError, 'unauthorized')) {
            throw new SwiggyReauthRequiredException('Swiggy Dineout authentication expired. Please reconnect.');
        }

        return $response;
    }

    /**
     * JSON-RPC "tools/call" convenience wrapper.
     */
    private function callTool(string $tool, array $arguments, ?int $userId = null): array
    {
        $response = $this->callSwiggyApi('/dineout', [
            'jsonrpc' => '2.0',
            'id' => 1,
            'method' => 'tools/call',
            'params' => [
                'name' => $tool,
                'arguments' => $arguments,
            ],
        ], $userId);

        return $response->json() ?? [];
    }

    public function listDineoutTools(?int $userId = null): array
    {
        $response = $this->callSwiggyApi('/dineout', [
            'jsonrpc' => '2.0',
            'id' => 1,
            'method' => 'tools/list',
            'params' => [],
        ], $userId);

        return $response->json('result.tools') ?? [];
    }

    public function getSavedLocations(?int $userId = null): array
    {
        $result = $this->callTool('get_saved_locations', [], $userId);

        return $result['result']['structuredContent']['data']['locations'] ?? [];
    }

    public function searchRestaurants(string $query, ?string $entityType = 'CUISINE', ?string $addressId = null, ?float $latitude = null, ?float $longitude = null, ?int $userId = null): array
    {
        $result = $this->callTool('search_restaurants_dineout', array_filter([
            'query' => $query,
            'entityType' => $entityType,
            'addressId' => $addressId ?? config('services.swiggy.default_address_id'),
            'latitude' => $latitude,
            'longitude' => $longitude,
        ]), $userId);

        return $this->decodeToolText($result['result']['content'][0]['text'] ?? $result);
    }

    public function getRestaurantDetails(string $restaurantId, float $latitude, float $longitude, ?int $userId = null): array
    {
        $result = $this->callTool('get_restaurant_details', [
            'restaurantId' => $restaurantId,
            'latitude' => $latitude,
            'longitude' => $longitude,
        ], $userId);

        return $result['result']['structuredContent'] ?? $result;
    }

    public function getAvailableSlots(string $restaurantId, string $date, int $guestCount, float $latitude, float $longitude, ?int $userId = null): array
    {
        $result = $this->callTool('get_available_slots', [
            'restaurantId' => $restaurantId,
            'date' => $date,
            'guestCount' => $guestCount,
            'latitude' => $latitude,
            'longitude' => $longitude,
        ], $userId);

        return $this->decodeToolText($result['result']['content'][0]['text'] ?? $result);
    }

    public function bookTable(string $restaurantId, int $slotId, string $itemId, int $reservationTime, int $guestCount, float $latitude, float $longitude, ?int $userId = null): array
    {
        return $this->callTool('book_table', [
            'restaurantId' => $restaurantId,
            'slotId' => $slotId,
            'itemId' => $itemId,
            'reservationTime' => $reservationTime,
            'guestCount' => $guestCount,
            'latitude' => $latitude,
            'longitude' => $longitude,
        ], $userId);
    }

    private function decodeToolText(mixed $value): array
    {
        if (is_array($value)) {
            return $value;
        }

        if (is_string($value)) {
            $decoded = json_decode($value, true);

            if (is_array($decoded)) {
                return $decoded;
            }
        }

        return ['text' => (string) $value];
    }
}
