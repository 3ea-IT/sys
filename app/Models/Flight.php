<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    protected $fillable = [
        'airline',
        'flight_number',
        'origin',
        'destination',
        'departure_time',
        'arrival_time',
        'duration_minutes',
        'seat_class',
        'aircraft_type',
        'image',
        'price',
        'capacity',
        'seats_available',
        'status',
    ];

    protected $casts = [
        'departure_time' => 'datetime',
        'arrival_time' => 'datetime',
        'duration_minutes' => 'integer',
        'price' => 'decimal:2',
        'capacity' => 'integer',
        'seats_available' => 'integer',
    ];

    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }

        if (str_starts_with($this->image, '/')) {
            return $this->image;
        }

        return '/banner/' . $this->image;
    }

    public function bookings()
    {
        return $this->hasMany(FlightBooking::class);
    }

    public function seats()
    {
        return $this->hasMany(FlightSeat::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeSearch($query, $origin, $destination)
    {
        return $query->when($origin, fn ($q) => $q->where('origin', 'like', "%{$origin}%"))
            ->when($destination, fn ($q) => $q->where('destination', 'like', "%{$destination}%"));
    }

    /**
     * Computed fare families (Basic/Standard/Flex), derived from the base price.
     * Not persisted — the chosen tier's rules are snapshotted onto FlightBooking at booking time.
     */
    public function fareTiers(): array
    {
        $standard = (float) $this->price;
        $basic = round($standard * 0.85, 2);
        $flex = round($standard * 1.25, 2);

        return [
            [
                'tier' => 'basic',
                'label' => 'Basic Saver',
                'price' => $basic,
                'baggage_checked_kg' => 0,
                'baggage_cabin_kg' => 7,
                'seat_selection_included' => false,
                'refundable' => false,
                'change_fee' => round($basic * 0.3, 2),
                'description' => 'Lowest fare. Cabin bag only — no free seat selection, no changes.',
            ],
            [
                'tier' => 'standard',
                'label' => 'Standard',
                'price' => $standard,
                'baggage_checked_kg' => 15,
                'baggage_cabin_kg' => 7,
                'seat_selection_included' => false,
                'refundable' => false,
                'change_fee' => round($standard * 0.2, 2),
                'description' => '15kg checked bag included. Changes allowed for a fee.',
            ],
            [
                'tier' => 'flex',
                'label' => 'Flex',
                'price' => $flex,
                'baggage_checked_kg' => 25,
                'baggage_cabin_kg' => 7,
                'seat_selection_included' => true,
                'refundable' => true,
                'change_fee' => 0,
                'description' => '25kg checked bag, free seat selection, free date changes, fully refundable.',
            ],
        ];
    }

    public function fareTier(string $tier): ?array
    {
        foreach ($this->fareTiers() as $fare) {
            if ($fare['tier'] === $tier) {
                return $fare;
            }
        }

        return null;
    }

    /**
     * Idempotent 6-across seat map (A-F). Rows 1-2 extra legroom, one mid-cabin exit row.
     */
    public function generateSeatMap(): void
    {
        if ($this->seats()->exists()) {
            return;
        }

        $letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        $totalRows = (int) ceil($this->capacity / 6);
        $exitRow = $totalRows > 4 ? (int) round($totalRows * 0.5) : null;

        $seats = [];
        $seatCount = 0;
        $now = now();

        for ($row = 1; $row <= $totalRows && $seatCount < $this->capacity; $row++) {
            foreach ($letters as $letter) {
                if ($seatCount >= $this->capacity) {
                    break;
                }

                if ($row <= 2) {
                    $type = 'extra_legroom';
                    $addon = 800;
                } elseif ($row === $exitRow) {
                    $type = 'exit_row';
                    $addon = 500;
                } else {
                    $type = 'standard';
                    $addon = 0;
                }

                $seats[] = [
                    'flight_id' => $this->id,
                    'seat_number' => "{$row}{$letter}",
                    'seat_type' => $type,
                    'price_addon' => $addon,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                $seatCount++;
            }
        }

        FlightSeat::insert($seats);
    }
}
