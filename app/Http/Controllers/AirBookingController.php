<?php

namespace App\Http\Controllers;

use App\Models\Flight;
use App\Models\FlightBooking;
use App\Models\FlightBookingAddon;
use App\Models\FlightTraveler;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AirBookingController extends Controller
{
    protected function timeBucket($departureTime): string
    {
        $hour = (int) $departureTime->format('H');

        if ($hour < 6) return 'night';
        if ($hour < 12) return 'morning';
        if ($hour < 18) return 'afternoon';
        return 'evening';
    }

    public function index(Request $request)
    {
        $origin = $request->get('origin');
        $destination = $request->get('destination');
        $date = $request->get('date');
        $sort = $request->get('sort', 'best');
        $airlines = array_filter((array) $request->get('airlines', []));
        $priceMin = $request->get('price_min');
        $priceMax = $request->get('price_max');
        $timeOfDay = $request->get('time_of_day');

        $query = Flight::active()->search($origin, $destination);

        if ($date) {
            $query->whereDate('departure_time', $date);
        }

        $availableAirlines = (clone $query)->distinct()->pluck('airline')->sort()->values();

        if (!empty($airlines)) {
            $query->whereIn('airline', $airlines);
        }

        $flights = $query->get()->map(function ($flight) {
            $tiers = $flight->fareTiers();

            return [
                'id' => $flight->id,
                'airline' => $flight->airline,
                'flight_number' => $flight->flight_number,
                'origin' => $flight->origin,
                'destination' => $flight->destination,
                'departure_time_raw' => $flight->departure_time,
                'departure_time' => $flight->departure_time->format('M d, Y h:i A'),
                'arrival_time' => $flight->arrival_time->format('M d, Y h:i A'),
                'duration_minutes' => $flight->duration_minutes,
                'seat_class' => $flight->seat_class,
                'image_url' => $flight->image_url,
                'from_price' => $tiers[0]['price'],
                'price' => (float) $flight->price,
                'time_bucket' => $this->timeBucket($flight->departure_time),
                'seats_available' => $flight->seats_available,
                'sold_out' => $flight->seats_available <= 0,
            ];
        });

        if ($priceMin !== null && $priceMin !== '') {
            $flights = $flights->filter(fn ($f) => $f['from_price'] >= (float) $priceMin);
        }
        if ($priceMax !== null && $priceMax !== '') {
            $flights = $flights->filter(fn ($f) => $f['from_price'] <= (float) $priceMax);
        }
        if ($timeOfDay) {
            $flights = $flights->filter(fn ($f) => $f['time_bucket'] === $timeOfDay);
        }

        $flights = match ($sort) {
            'cheapest' => $flights->sortBy('from_price'),
            'fastest' => $flights->sortBy('duration_minutes'),
            'earliest' => $flights->sortBy('departure_time_raw'),
            default => $this->sortByBestScore($flights),
        };

        $flights = $flights->values()->map(function ($f) {
            unset($f['departure_time_raw']);
            return $f;
        });

        return Inertia::render('AirBooking/Index', [
            'flights' => $flights,
            'filters' => [
                'origin' => $origin ?? '',
                'destination' => $destination ?? '',
                'date' => $date ?? '',
                'sort' => $sort,
                'airlines' => array_values($airlines),
                'price_min' => $priceMin ?? '',
                'price_max' => $priceMax ?? '',
                'time_of_day' => $timeOfDay ?? '',
            ],
            'availableAirlines' => $availableAirlines,
        ]);
    }

    protected function sortByBestScore($flights)
    {
        $byPrice = $flights->sortBy('from_price')->values();
        $byDuration = $flights->sortBy('duration_minutes')->values();

        $priceRank = [];
        foreach ($byPrice as $i => $f) {
            $priceRank[$f['id']] = $i;
        }
        $durationRank = [];
        foreach ($byDuration as $i => $f) {
            $durationRank[$f['id']] = $i;
        }

        return $flights->sortBy(fn ($f) => $priceRank[$f['id']] + $durationRank[$f['id']]);
    }

    public function show($id)
    {
        $flight = Flight::findOrFail($id);

        if ($flight->status !== 'active' && (!Auth::check() || Auth::user()->role !== 'admin')) {
            abort(403);
        }

        $user = Auth::user();
        $existingBooking = $user
            ? FlightBooking::where('user_id', $user->id)
                ->where('flight_id', $flight->id)
                ->where('status', 'confirmed')
                ->first()
            : null;

        return Inertia::render('AirBooking/Show', [
            'flight' => [
                'id' => $flight->id,
                'airline' => $flight->airline,
                'flight_number' => $flight->flight_number,
                'origin' => $flight->origin,
                'destination' => $flight->destination,
                'departure_time' => $flight->departure_time->format('M d, Y h:i A'),
                'arrival_time' => $flight->arrival_time->format('M d, Y h:i A'),
                'duration_minutes' => $flight->duration_minutes,
                'seat_class' => $flight->seat_class,
                'aircraft_type' => $flight->aircraft_type,
                'image_url' => $flight->image_url,
                'seats_available' => $flight->seats_available,
                'sold_out' => $flight->seats_available <= 0,
                'fare_tiers' => $flight->fareTiers(),
                'existing_booking' => $existingBooking ? [
                    'id' => $existingBooking->id,
                    'booking_reference' => $existingBooking->booking_reference,
                ] : null,
            ],
        ]);
    }

    /**
     * Step 1: fare + passenger count -> creates a draft booking and pre-creates blank traveler slots.
     */
    public function start(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $flight = Flight::where('status', 'active')->findOrFail($id);

        $validated = $request->validate([
            'fare_tier' => 'required|in:basic,standard,flex',
            'passenger_count' => 'required|integer|min:1|max:9',
        ]);

        $passengerCount = (int) $validated['passenger_count'];

        if ($flight->seats_available < $passengerCount) {
            return back()->with('error', "Only {$flight->seats_available} seat(s) available on this flight.");
        }

        $tier = $flight->fareTier($validated['fare_tier']);
        $fareTotal = $tier['price'] * $passengerCount;

        return DB::transaction(function () use ($user, $flight, $passengerCount, $tier, $fareTotal) {
            $booking = FlightBooking::create([
                'user_id' => $user->id,
                'flight_id' => $flight->id,
                'passenger_count' => $passengerCount,
                'fare_tier' => $tier['tier'],
                'fare_label' => $tier['label'],
                'baggage_checked_kg' => $tier['baggage_checked_kg'],
                'baggage_cabin_kg' => $tier['baggage_cabin_kg'],
                'seat_selection_included' => $tier['seat_selection_included'],
                'refundable' => $tier['refundable'],
                'change_fee' => $tier['change_fee'],
                'amount_per_seat' => $tier['price'],
                'fare_total' => $fareTotal,
                'seats_total' => 0,
                'addons_total' => 0,
                'total_amount' => $fareTotal,
                'status' => 'draft',
            ]);

            for ($i = 0; $i < $passengerCount; $i++) {
                FlightTraveler::create([
                    'flight_booking_id' => $booking->id,
                    'type' => 'adult',
                    'first_name' => '',
                    'last_name' => '',
                ]);
            }

            return redirect()->route('air-booking.checkout.travelers', $booking);
        });
    }

    protected function authorizeDraft(FlightBooking $booking)
    {
        if (Auth::id() !== $booking->user_id) {
            abort(403);
        }

        if ($booking->status !== 'draft') {
            abort(404);
        }
    }

    public function travelersStep(FlightBooking $booking)
    {
        $this->authorizeDraft($booking);

        $flight = $booking->flight;

        return Inertia::render('AirBooking/Checkout/Travelers', [
            'booking' => [
                'id' => $booking->id,
                'passenger_count' => $booking->passenger_count,
                'fare_label' => $booking->fare_label,
            ],
            'flight' => [
                'airline' => $flight->airline,
                'flight_number' => $flight->flight_number,
                'origin' => $flight->origin,
                'destination' => $flight->destination,
                'departure_time' => $flight->departure_time->format('M d, Y h:i A'),
            ],
            'travelers' => $booking->travelers()->orderBy('id')->get(),
        ]);
    }

    public function travelersStore(Request $request, FlightBooking $booking)
    {
        $this->authorizeDraft($booking);

        $validated = $request->validate([
            'travelers' => 'required|array|size:' . $booking->passenger_count,
            'travelers.*.type' => 'required|in:adult,child,infant',
            'travelers.*.title' => 'nullable|string|max:10',
            'travelers.*.first_name' => 'required|string|max:100',
            'travelers.*.last_name' => 'required|string|max:100',
            'travelers.*.dob' => 'nullable|date',
            'travelers.*.passport_number' => 'nullable|string|max:30',
            'travelers.*.passport_expiry' => 'nullable|date',
            'travelers.*.passport_country' => 'nullable|string|max:60',
            'travelers.*.special_assistance' => 'nullable|string|max:60',
            'travelers.*.meal_preference' => 'nullable|string|max:60',
        ]);

        $existing = $booking->travelers()->orderBy('id')->get();

        foreach ($validated['travelers'] as $index => $data) {
            $traveler = $existing[$index] ?? null;
            if ($traveler) {
                $traveler->update($data);
            }
        }

        return redirect()->route('air-booking.checkout.seats', $booking);
    }

    public function seatsStep(FlightBooking $booking)
    {
        $this->authorizeDraft($booking);

        $flight = $booking->flight;
        $flight->generateSeatMap();

        $occupiedSeatIds = FlightTraveler::whereHas('booking', function ($q) use ($flight, $booking) {
            $q->where('flight_id', $flight->id)
                ->where('status', 'confirmed')
                ->where('id', '!=', $booking->id);
        })->whereNotNull('seat_id')->pluck('seat_id');

        return Inertia::render('AirBooking/Checkout/Seats', [
            'booking' => ['id' => $booking->id, 'seats_total' => (float) $booking->seats_total],
            'flight' => [
                'airline' => $flight->airline,
                'flight_number' => $flight->flight_number,
                'aircraft_type' => $flight->aircraft_type,
            ],
            'seats' => $flight->seats()->orderBy('seat_number')->get()->map(fn ($seat) => [
                'id' => $seat->id,
                'seat_number' => $seat->seat_number,
                'seat_type' => $seat->seat_type,
                'price_addon' => (float) $seat->price_addon,
                'occupied' => $occupiedSeatIds->contains($seat->id),
            ]),
            'travelers' => $booking->travelers()->orderBy('id')->get(['id', 'first_name', 'last_name', 'seat_id']),
        ]);
    }

    public function seatsStore(Request $request, FlightBooking $booking)
    {
        $this->authorizeDraft($booking);

        $validated = $request->validate([
            'assignments' => 'array',
            'assignments.*' => 'nullable|integer|exists:flight_seats,id',
        ]);

        $travelerIds = $booking->travelers()->pluck('id');
        $assignments = $validated['assignments'] ?? [];

        $chosenSeatIds = array_filter(array_values($assignments));
        if (count($chosenSeatIds) !== count(array_unique($chosenSeatIds))) {
            return back()->with('error', 'Each seat can only be assigned to one traveler.');
        }

        $occupiedSeatIds = FlightTraveler::whereHas('booking', function ($q) use ($booking) {
            $q->where('flight_id', $booking->flight_id)
                ->where('status', 'confirmed')
                ->where('id', '!=', $booking->id);
        })->whereNotNull('seat_id')->pluck('seat_id')->all();

        if (array_intersect($chosenSeatIds, $occupiedSeatIds)) {
            return back()->with('error', 'One of the selected seats was just taken. Please choose another.');
        }

        $seatsTotal = 0;
        foreach ($assignments as $travelerId => $seatId) {
            if (!$travelerIds->contains((int) $travelerId)) {
                continue;
            }

            FlightTraveler::where('id', $travelerId)->update(['seat_id' => $seatId ?: null]);

            if ($seatId) {
                $seatsTotal += (float) $booking->flight->seats()->find($seatId)?->price_addon;
            }
        }

        $booking->update([
            'seats_total' => $seatsTotal,
            'total_amount' => $booking->fare_total + $seatsTotal + $booking->addons_total,
        ]);

        return redirect()->route('air-booking.checkout.addons', $booking);
    }

    protected function addonCatalog(): array
    {
        return [
            'extra_bag' => ['label' => 'Extra checked bag (23kg)', 'unit_price' => 1500],
            'priority_boarding' => ['label' => 'Priority boarding', 'unit_price' => 300],
            'travel_insurance' => ['label' => 'Travel protection', 'unit_price' => 250],
        ];
    }

    public function addonsStep(FlightBooking $booking)
    {
        $this->authorizeDraft($booking);

        $existing = $booking->addons()->get()->keyBy('type');

        return Inertia::render('AirBooking/Checkout/AddOns', [
            'booking' => [
                'id' => $booking->id,
                'passenger_count' => $booking->passenger_count,
                'addons_total' => (float) $booking->addons_total,
            ],
            'catalog' => $this->addonCatalog(),
            'selected' => [
                'extra_bags' => $existing->get('extra_bag')?->quantity ?? 0,
                'priority_boarding' => $existing->has('priority_boarding'),
                'travel_insurance' => $existing->has('travel_insurance'),
            ],
        ]);
    }

    public function addonsStore(Request $request, FlightBooking $booking)
    {
        $this->authorizeDraft($booking);

        $validated = $request->validate([
            'extra_bags' => 'nullable|integer|min:0|max:10',
            'priority_boarding' => 'boolean',
            'travel_insurance' => 'boolean',
        ]);

        $catalog = $this->addonCatalog();
        $booking->addons()->delete();

        $addonsTotal = 0;

        $extraBags = (int) ($validated['extra_bags'] ?? 0);
        if ($extraBags > 0) {
            $unit = $catalog['extra_bag']['unit_price'];
            FlightBookingAddon::create([
                'flight_booking_id' => $booking->id,
                'type' => 'extra_bag',
                'quantity' => $extraBags,
                'unit_price' => $unit,
                'total_price' => $unit * $extraBags,
            ]);
            $addonsTotal += $unit * $extraBags;
        }

        if (!empty($validated['priority_boarding'])) {
            $unit = $catalog['priority_boarding']['unit_price'];
            $qty = $booking->passenger_count;
            FlightBookingAddon::create([
                'flight_booking_id' => $booking->id,
                'type' => 'priority_boarding',
                'quantity' => $qty,
                'unit_price' => $unit,
                'total_price' => $unit * $qty,
            ]);
            $addonsTotal += $unit * $qty;
        }

        if (!empty($validated['travel_insurance'])) {
            $unit = $catalog['travel_insurance']['unit_price'];
            $qty = $booking->passenger_count;
            FlightBookingAddon::create([
                'flight_booking_id' => $booking->id,
                'type' => 'travel_insurance',
                'quantity' => $qty,
                'unit_price' => $unit,
                'total_price' => $unit * $qty,
            ]);
            $addonsTotal += $unit * $qty;
        }

        $booking->update([
            'addons_total' => $addonsTotal,
            'total_amount' => $booking->fare_total + $booking->seats_total + $addonsTotal,
        ]);

        return redirect()->route('air-booking.checkout.review', $booking);
    }

    public function reviewStep(FlightBooking $booking)
    {
        $this->authorizeDraft($booking);

        $user = Auth::user();
        $flight = $booking->flight;

        return Inertia::render('AirBooking/Checkout/Review', [
            'booking' => [
                'id' => $booking->id,
                'fare_label' => $booking->fare_label,
                'passenger_count' => $booking->passenger_count,
                'fare_total' => (float) $booking->fare_total,
                'seats_total' => (float) $booking->seats_total,
                'addons_total' => (float) $booking->addons_total,
                'total_amount' => (float) $booking->total_amount,
                'refundable' => $booking->refundable,
                'change_fee' => (float) $booking->change_fee,
                'baggage_checked_kg' => $booking->baggage_checked_kg,
                'baggage_cabin_kg' => $booking->baggage_cabin_kg,
                'contact_email' => $booking->contact_email ?? $user->email,
                'contact_phone' => $booking->contact_phone ?? $user->phone ?? '',
                'wallet_balance' => (float) ($user->wallet->balance ?? 0),
            ],
            'flight' => [
                'airline' => $flight->airline,
                'flight_number' => $flight->flight_number,
                'origin' => $flight->origin,
                'destination' => $flight->destination,
                'departure_time' => $flight->departure_time->format('M d, Y h:i A'),
                'arrival_time' => $flight->arrival_time->format('M d, Y h:i A'),
                'seats_available' => $flight->seats_available,
            ],
            'travelers' => $booking->travelers()->with('seat')->orderBy('id')->get()->map(fn ($t) => [
                'name' => trim("{$t->first_name} {$t->last_name}"),
                'seat_number' => $t->seat?->seat_number,
            ]),
            'addons' => $booking->addons()->get()->map(fn ($a) => [
                'type' => $a->type,
                'quantity' => $a->quantity,
                'total_price' => (float) $a->total_price,
            ]),
        ]);
    }

    public function reviewConfirm(Request $request, FlightBooking $booking)
    {
        $this->authorizeDraft($booking);

        $user = Auth::user();

        $validated = $request->validate([
            'contact_email' => 'required|email',
            'contact_phone' => 'required|string|max:20',
        ]);

        $flight = $booking->flight()->lockForUpdate()->first();

        if ($flight->seats_available < $booking->passenger_count) {
            return back()->with('error', 'This flight no longer has enough seats available. Please search again.');
        }

        return DB::transaction(function () use ($user, $flight, $booking, $validated) {
            $wallet = $user->wallet ?? $user->wallet()->create(['balance' => 0]);

            if ($wallet->balance < $booking->total_amount) {
                return back()->with('error', 'Insufficient wallet balance.');
            }

            $wallet->decrement('balance', $booking->total_amount);
            $flight->decrement('seats_available', $booking->passenger_count);

            $booking->update([
                'status' => 'confirmed',
                'contact_email' => $validated['contact_email'],
                'contact_phone' => $validated['contact_phone'],
            ]);

            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'amount' => $booking->total_amount,
                'type' => 'debit',
                'description' => "Flight booking #{$booking->id} ({$booking->fare_label}) for {$booking->passenger_count} passenger(s) - {$flight->airline} {$flight->flight_number}",
            ]);

            return redirect()->route('air-booking.booking', $booking)
                ->with('success', 'Flight booked successfully!');
        });
    }

    public function showBooking(FlightBooking $booking)
    {
        if (Auth::id() !== $booking->user_id) {
            abort(403);
        }

        $flight = $booking->flight;

        return Inertia::render('AirBooking/Booking', [
            'booking' => [
                'id' => $booking->id,
                'booking_reference' => $booking->booking_reference,
                'fare_label' => $booking->fare_label,
                'passenger_count' => $booking->passenger_count,
                'fare_total' => (float) $booking->fare_total,
                'seats_total' => (float) $booking->seats_total,
                'addons_total' => (float) $booking->addons_total,
                'total_amount' => (float) $booking->total_amount,
                'refundable' => $booking->refundable,
                'change_fee' => (float) $booking->change_fee,
                'baggage_checked_kg' => $booking->baggage_checked_kg,
                'baggage_cabin_kg' => $booking->baggage_cabin_kg,
                'status' => $booking->status,
                'contact_email' => $booking->contact_email,
                'contact_phone' => $booking->contact_phone,
                'created_at' => $booking->created_at->format('M d, Y h:i A'),
            ],
            'flight' => [
                'id' => $flight->id,
                'airline' => $flight->airline,
                'flight_number' => $flight->flight_number,
                'origin' => $flight->origin,
                'destination' => $flight->destination,
                'departure_time' => $flight->departure_time->format('M d, Y h:i A'),
                'arrival_time' => $flight->arrival_time->format('M d, Y h:i A'),
                'image_url' => $flight->image_url,
                'is_past' => $flight->departure_time->isPast(),
            ],
            'travelers' => $booking->travelers()->with('seat')->orderBy('id')->get()->map(fn ($t) => [
                'name' => trim("{$t->first_name} {$t->last_name}"),
                'type' => $t->type,
                'seat_number' => $t->seat?->seat_number,
            ]),
            'addons' => $booking->addons()->get()->map(fn ($a) => [
                'type' => $a->type,
                'quantity' => $a->quantity,
                'total_price' => (float) $a->total_price,
            ]),
        ]);
    }

    public function myBookings()
    {
        $user = Auth::user();

        $bookings = FlightBooking::with('flight')
            ->where('user_id', $user->id)
            ->where('status', '!=', 'draft')
            ->latest()
            ->paginate(10)
            ->through(fn ($b) => [
                'id' => $b->id,
                'booking_reference' => $b->booking_reference,
                'status' => $b->status,
                'total_amount' => (float) $b->total_amount,
                'passenger_count' => $b->passenger_count,
                'flight' => [
                    'airline' => $b->flight->airline,
                    'flight_number' => $b->flight->flight_number,
                    'origin' => $b->flight->origin,
                    'destination' => $b->flight->destination,
                    'departure_time' => $b->flight->departure_time->format('M d, Y h:i A'),
                ],
            ]);

        return Inertia::render('AirBooking/MyBookings', [
            'bookings' => $bookings,
        ]);
    }

    public function cancelBooking(FlightBooking $booking)
    {
        $user = Auth::user();

        if (!$user || $booking->user_id !== $user->id) {
            abort(403);
        }

        if ($booking->status !== 'confirmed') {
            return back()->with('error', 'Cannot cancel this booking.');
        }

        return DB::transaction(function () use ($booking, $user) {
            $refund = $booking->refundAmount();

            $wallet = $user->wallet;
            $wallet->increment('balance', $refund);

            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'amount' => $refund,
                'type' => 'credit',
                'description' => "Flight booking cancellation #{$booking->id}" . ($refund < $booking->total_amount ? ' (cancellation fee applied)' : ''),
            ]);

            $booking->cancel();

            return redirect()->route('air-booking.booking', $booking)
                ->with('success', $refund > 0
                    ? "Booking cancelled. \u{20B9}" . number_format($refund, 2) . ' refunded to your wallet.'
                    : 'Booking cancelled. This fare was non-refundable.');
        });
    }

    public function changeStep(FlightBooking $booking)
    {
        if (Auth::id() !== $booking->user_id) {
            abort(403);
        }

        if ($booking->status !== 'confirmed') {
            abort(404);
        }

        $flight = $booking->flight;

        $alternatives = Flight::active()
            ->where('origin', $flight->origin)
            ->where('destination', $flight->destination)
            ->where('id', '!=', $flight->id)
            ->where('departure_time', '>', now())
            ->where('seats_available', '>=', $booking->passenger_count)
            ->orderBy('departure_time')
            ->get()
            ->map(fn ($f) => [
                'id' => $f->id,
                'airline' => $f->airline,
                'flight_number' => $f->flight_number,
                'departure_time' => $f->departure_time->format('M d, Y h:i A'),
                'arrival_time' => $f->arrival_time->format('M d, Y h:i A'),
                'fare_tiers' => $f->fareTiers(),
            ]);

        return Inertia::render('AirBooking/Change', [
            'booking' => [
                'id' => $booking->id,
                'fare_tier' => $booking->fare_tier,
                'fare_label' => $booking->fare_label,
                'fare_total' => (float) $booking->fare_total,
                'passenger_count' => $booking->passenger_count,
            ],
            'flight' => [
                'airline' => $flight->airline,
                'flight_number' => $flight->flight_number,
                'origin' => $flight->origin,
                'destination' => $flight->destination,
                'departure_time' => $flight->departure_time->format('M d, Y h:i A'),
            ],
            'alternatives' => $alternatives,
        ]);
    }

    public function changeConfirm(Request $request, FlightBooking $booking)
    {
        $user = Auth::user();

        if (!$user || $booking->user_id !== $user->id) {
            abort(403);
        }

        if ($booking->status !== 'confirmed') {
            abort(404);
        }

        $validated = $request->validate([
            'new_flight_id' => 'required|exists:flights,id',
            'new_fare_tier' => 'required|in:basic,standard,flex',
        ]);

        $oldFlight = $booking->flight;
        $newFlight = Flight::where('status', 'active')->findOrFail($validated['new_flight_id']);

        if ($newFlight->seats_available < $booking->passenger_count) {
            return back()->with('error', 'The selected flight no longer has enough seats.');
        }

        $tier = $newFlight->fareTier($validated['new_fare_tier']);
        $newFareTotal = $tier['price'] * $booking->passenger_count;
        $diff = $newFareTotal - $booking->fare_total;

        return DB::transaction(function () use ($user, $oldFlight, $newFlight, $booking, $tier, $newFareTotal, $diff) {
            $wallet = $user->wallet ?? $user->wallet()->create(['balance' => 0]);

            if ($diff > 0 && $wallet->balance < $diff) {
                return back()->with('error', 'Insufficient wallet balance to cover the fare difference.');
            }

            if ($diff > 0) {
                $wallet->decrement('balance', $diff);
            } elseif ($diff < 0) {
                $wallet->increment('balance', abs($diff));
            }

            $oldFlight->increment('seats_available', $booking->passenger_count);
            $newFlight->decrement('seats_available', $booking->passenger_count);

            // Seats are flight-specific — cleared on change; auto-assigned at check-in, per the seat-selection fallback.
            $booking->travelers()->update(['seat_id' => null]);

            $booking->update([
                'flight_id' => $newFlight->id,
                'fare_tier' => $tier['tier'],
                'fare_label' => $tier['label'],
                'baggage_checked_kg' => $tier['baggage_checked_kg'],
                'baggage_cabin_kg' => $tier['baggage_cabin_kg'],
                'seat_selection_included' => $tier['seat_selection_included'],
                'refundable' => $tier['refundable'],
                'change_fee' => $tier['change_fee'],
                'amount_per_seat' => $tier['price'],
                'fare_total' => $newFareTotal,
                'seats_total' => 0,
                'total_amount' => $newFareTotal + $booking->addons_total,
            ]);

            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'amount' => abs($diff),
                'type' => $diff >= 0 ? 'debit' : 'credit',
                'description' => "Flight change for booking #{$booking->id} - now {$newFlight->airline} {$newFlight->flight_number}",
            ]);

            return redirect()->route('air-booking.booking', $booking)
                ->with('success', 'Flight changed successfully. Seats will be auto-assigned at check-in.');
        });
    }
}
