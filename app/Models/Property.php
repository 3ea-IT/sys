<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $fillable = [
        'name',
        'type',
        'location',
        'image',
        'price_per_night',
        'rating',
        'amenities',
        'description',
        'status',
    ];

    protected $casts = [
        'price_per_night' => 'decimal:2',
        'rating' => 'decimal:1',
        'amenities' => 'array',
    ];

    public function getImageUrlAttribute()
    {
        if ($this->image) {
            if (str_starts_with($this->image, '/')) {
                return $this->image;
            }

            return '/banner/' . $this->image;
        }

        return $this->apiImageUrl();
    }

    /**
     * Stable, category-relevant photo from a keyless image API — used whenever no file has been uploaded.
     * The same property always resolves to the same photo (locked by id + offset), so it doesn't
     * change across page loads while still giving each property a distinct image.
     */
    public function apiImageUrl(int $lockOffset = 0, int $width = 800, int $height = 600): string
    {
        $keyword = self::apiKeywordForType($this->type);
        $lock = $this->id * 10 + $lockOffset;

        return "https://loremflickr.com/{$width}/{$height}/{$keyword}?lock={$lock}";
    }

    /**
     * Synthetic gallery for properties with no uploaded photos — a handful of distinct
     * locked images so the detail page gallery isn't empty.
     */
    public function apiGalleryUrls(int $count = 4): array
    {
        return collect(range(1, $count))
            ->map(fn ($i) => $this->apiImageUrl($i))
            ->all();
    }

    public static function apiKeywordForType(?string $type): string
    {
        return match ($type) {
            'Hotel' => 'hotel',
            'Resort' => 'resort',
            'Homestay' => 'cottage',
            'Guest House' => 'bungalow',
            'Vacation Rental' => 'villa',
            default => 'hotel',
        };
    }

    public function roomTypes()
    {
        return $this->hasMany(RoomType::class);
    }

    public function images()
    {
        return $this->hasMany(PropertyImage::class)->orderBy('sort_order');
    }

    public function bookings()
    {
        return $this->hasManyThrough(PropertyBooking::class, RoomType::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('location', 'like', "%{$search}%");
        });
    }

    public function scopeMinRating($query, $rating)
    {
        return $query->where('rating', '>=', $rating);
    }

    /**
     * Property must have ALL of the given amenities (AND semantics).
     */
    public function scopeHasAmenities($query, array $amenities)
    {
        foreach ($amenities as $amenity) {
            $query->whereJsonContains('amenities', $amenity);
        }

        return $query;
    }
}
