<?php

namespace App\Http\Controllers;

use App\Services\SwiggyDineoutService;
use App\Services\SwiggyReauthRequiredException;
use App\Models\SwiggyDineoutBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Laravel equivalent of the Node "swiggy" CLI (server.js) — but per-user,
 * for the customer-facing Dining flow, not admin.
 *
 * Every logged-in user connects their OWN Swiggy account. The access
 * token is stored per user_id in swiggy_dineout_tokens.
 *
 *   node server.js login              -> GET  dineout/connect
 *   node server.js status             -> GET  dineout                 (Inertia page)
 *   node server.js dineout-locations  -> GET  dineout/locations
 *   node server.js search-dineout     -> GET  dineout/search
 *   node server.js dineout-details    -> GET  dineout/restaurants/{id}
 *   node server.js dineout-slots      -> GET  dineout/restaurants/{id}/slots
 *   node server.js book-table         -> POST dineout/restaurants/{id}/book
 */
class DineoutController extends Controller
{
    public function __construct(private SwiggyDineoutService $swiggy)
    {
    }

    /**
     * Status page — mirrors `node server.js status`.
     */
    public function index()
    {
        $token = $this->swiggy->getStoredToken(Auth::id());

        return Inertia::render('Dineout/Status', [
            'connected' => (bool) ($token && $token->isValid()),
            'token' => $token ? [
                'obtained_at' => optional($token->obtained_at)->toDateTimeString(),
                'expires_at' => optional($token->expires_at)->toDateTimeString(),
                'scope' => $token->scope,
                'remaining_hours' => $token->expires_at
                    ? round(now()->diffInMinutes($token->expires_at, false) / 60, 1)
                    : null,
            ] : null,
        ]);
    }

    /**
     * Kick off the OAuth 2.1 PKCE flow — mirrors `node server.js login`.
     * Redirects the logged-in user's own browser to Swiggy and stashes
     * PKCE state in their session until callback() runs.
     */
    public function connect(Request $request)
    {
        $redirectUri = config('services.swiggy.redirect_uri') ?: route('dineout.callback');

        $auth = $this->swiggy->buildAuthorizeUrl($redirectUri);

        $request->session()->put('swiggy_oauth', [
            'state' => $auth['state'],
            'code_verifier' => $auth['code_verifier'],
            'client_id' => $auth['client_id'],
            'redirect_uri' => $redirectUri,
        ]);

        return redirect()->away($auth['url']);
    }

    /**
     * OAuth callback — mirrors the local http.createServer handler in auth.js.
     */
    public function callback(Request $request)
    {
        $pending = $request->session()->pull('swiggy_oauth');

        if ($request->get('error')) {
            return redirect()->route('dineout.index')
                ->with('error', 'Swiggy authentication failed: ' . $request->get('error'));
        }

        if (!$pending || $request->get('state') !== $pending['state']) {
            return redirect()->route('dineout.index')
                ->with('error', 'Invalid OAuth state (possible CSRF). Please try connecting again.');
        }

        $code = $request->get('code');

        if (!$code) {
            return redirect()->route('dineout.index')
                ->with('error', 'No authorization code received from Swiggy.');
        }

        try {
            $this->swiggy->exchangeCodeForToken(
                $code,
                $pending['code_verifier'],
                $pending['redirect_uri'],
                $pending['client_id'],
                Auth::id()
            );
        } catch (\Throwable $e) {
            return redirect()->route('dineout.index')
                ->with('error', 'Token exchange failed: ' . $e->getMessage());
        }

        return redirect()->route('dineout.index')
            ->with('success', 'Swiggy Dineout connected successfully!');
    }

    /**
     * Mirrors `node server.js dineout-locations`.
     */
    public function locations()
    {
        try {
            return response()->json([
                'locations' => $this->swiggy->getSavedLocations(Auth::id()),
            ]);
        } catch (SwiggyReauthRequiredException $e) {
            return $this->reauthResponse($e);
        }
    }

    /**
     * Mirrors `node server.js search-dineout [query] [entityType]`.
     */
    public function search(Request $request)
    {
        $validated = $request->validate([
            'query' => 'required|string',
            'entity_type' => 'nullable|string',
            'address_id' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        try {
            $results = $this->swiggy->searchRestaurants(
                $validated['query'],
                $validated['entity_type'] ?? 'CUISINE',
                $validated['address_id'] ?? null,
                isset($validated['latitude']) ? (float) $validated['latitude'] : null,
                isset($validated['longitude']) ? (float) $validated['longitude'] : null,
                Auth::id()
            );

            return response()->json(['results' => $results]);
        } catch (SwiggyReauthRequiredException $e) {
            return $this->reauthResponse($e);
        }
    }

    /**
     * Mirrors `node server.js dineout-details [restaurantId] [lat] [lng]`.
     */
    public function restaurantDetails(Request $request, string $restaurantId)
    {
        $validated = $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        try {
            $details = $this->swiggy->getRestaurantDetails(
                $restaurantId,
                (float) $validated['latitude'],
                (float) $validated['longitude'],
                Auth::id()
            );

            return response()->json(['restaurant' => $details]);
        } catch (SwiggyReauthRequiredException $e) {
            return $this->reauthResponse($e);
        }
    }

    public function bookingPage(Request $request, string $restaurantId)
    {
        return Inertia::render('Dineout/RestaurantBooking', [
            'restaurant' => [
                'id' => $restaurantId,
                'name' => $request->string('name')->toString() ?: 'Restaurant',
                'description' => $request->string('description')->toString() ?: 'Swiggy Dineout restaurant',
            ],
            'coordinates' => [
                'latitude' => (float) $request->input('latitude', 26.996309),
                'longitude' => (float) $request->input('longitude', 80.8973584),
            ],
        ]);
    }

    /**
     * Mirrors `node server.js dineout-slots [restaurantId] [date] [guests]`.
     */
    public function slots(Request $request, string $restaurantId)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'guest_count' => 'nullable|integer|min:1|max:20',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        try {
            $slots = $this->swiggy->getAvailableSlots(
                $restaurantId,
                $validated['date'],
                (int) ($validated['guest_count'] ?? 2),
                (float) $validated['latitude'],
                (float) $validated['longitude'],
                Auth::id()
            );

            return response()->json(['slots' => $slots]);
        } catch (SwiggyReauthRequiredException $e) {
            return $this->reauthResponse($e);
        }
    }

    /**
     * Mirrors `node server.js book-table <restId> <slotId> <itemId> <time> [guests]`.
     */
    public function bookTable(Request $request, string $restaurantId)
    {
        $validated = $request->validate([
            'slot_id' => 'required|integer',
            'item_id' => 'required|string',
            'reservation_time' => 'required|integer',
            'reservation_date' => 'required|date',
            'restaurant_name' => 'nullable|string|max:255',
            'guest_count' => 'nullable|integer|min:1|max:20',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        try {
            $result = $this->swiggy->bookTable(
                $restaurantId,
                (int) $validated['slot_id'],
                $validated['item_id'],
                (int) $validated['reservation_time'],
                (int) ($validated['guest_count'] ?? 2),
                (float) $validated['latitude'],
                (float) $validated['longitude'],
                Auth::id()
            );

            $resultText = json_encode($result);
            $bookingFailed = ($result['result']['isError'] ?? false)
                || str_contains(strtolower($resultText), 'cart api error')
                || str_contains(strtolower($resultText), 'already purchased')
                || str_contains(strtolower($resultText), 'something went wrong');

            if ($bookingFailed) {
                return response()->json([
                    'error' => 'Swiggy could not confirm this table. You may have reached the maximum bookings for this date. Please choose another date or slot.',
                    'swiggy_response' => $result,
                ], 422);
            }

            $booking = SwiggyDineoutBooking::create([
                'user_id' => Auth::id(),
                'restaurant_id' => $restaurantId,
                'restaurant_name' => $validated['restaurant_name'] ?? null,
                'reservation_date' => $validated['reservation_date'],
                'reservation_time' => (string) $validated['reservation_time'],
                'guest_count' => (int) ($validated['guest_count'] ?? 2),
                'slot_id' => (int) $validated['slot_id'],
                'item_id' => $validated['item_id'],
                'latitude' => (float) $validated['latitude'],
                'longitude' => (float) $validated['longitude'],
                'swiggy_response' => $result,
            ]);

            return response()->json(['booking' => $result, 'record' => $booking]);
        } catch (SwiggyReauthRequiredException $e) {
            return $this->reauthResponse($e);
        }
    }

    public function bookings()
    {
        return response()->json([
            'bookings' => SwiggyDineoutBooking::where('user_id', Auth::id())
                ->latest('reservation_date')
                ->latest('reservation_time')
                ->get(),
        ]);
    }

    /**
     * Consistent 401-style response telling the frontend to send the
     * user back through connect().
     */
    private function reauthResponse(SwiggyReauthRequiredException $e)
    {
        return response()->json([
            'error' => $e->getMessage(),
            'reconnect_url' => route('dineout.connect'),
        ], 401);
    }
}
