<?php

namespace Database\Seeders;

use App\Models\DiningOffer;
use App\Models\Restaurant;
use Illuminate\Database\Seeder;

class DiningOfferSeeder extends Seeder
{
    public function run(): void
    {
        $offers = [
            [
                'restaurant' => 'Spice Route',
                'title' => 'Flat 20% off on dinner',
                'description' => 'Valid on à la carte orders above ₹800, dine-in only.',
                'discount_percent' => 20,
                'valid_until' => now()->addMonths(2)->toDateString(),
                'status' => 'active',
            ],
            [
                'restaurant' => 'Coastal Curry House',
                'title' => 'Weekend Seafood Feast — 15% off',
                'description' => 'Applicable on the seafood platter and thali on Saturdays and Sundays.',
                'discount_percent' => 15,
                'valid_until' => now()->addMonth()->toDateString(),
                'status' => 'active',
            ],
            [
                'restaurant' => 'The Grand Thali',
                'title' => 'Complimentary dessert with every thali',
                'description' => 'Get a free traditional Rajasthani dessert with every unlimited thali order.',
                'discount_percent' => null,
                'valid_until' => now()->addMonths(3)->toDateString(),
                'status' => 'active',
            ],
        ];

        foreach ($offers as $offer) {
            $restaurant = Restaurant::where('name', $offer['restaurant'])->first();

            if (!$restaurant) {
                continue;
            }

            unset($offer['restaurant']);
            $offer['restaurant_id'] = $restaurant->id;

            DiningOffer::create($offer);
        }
    }
}
