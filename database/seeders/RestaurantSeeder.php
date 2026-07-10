<?php

namespace Database\Seeders;

use App\Models\Restaurant;
use Illuminate\Database\Seeder;

class RestaurantSeeder extends Seeder
{
    public function run(): void
    {
        $restaurants = [
            [
                'name' => 'Spice Route',
                'location' => 'Connaught Place, Delhi',
                'cuisine' => 'North Indian',
                'image' => null,
                'price_range' => 'mid',
                'rating' => 4.3,
                'description' => 'Authentic North Indian cuisine with a modern twist, known for its butter chicken and tandoori specialties.',
                'opening_hours' => ['Mon-Sun' => '12:00 PM - 11:00 PM'],
                'table_capacity' => 40,
                'status' => 'active',
            ],
            [
                'name' => 'Punjabi Tadka',
                'location' => 'Sector 17, Chandigarh',
                'cuisine' => 'Punjabi',
                'image' => null,
                'price_range' => 'budget',
                'rating' => 4.1,
                'description' => 'Home-style Punjabi food served in generous portions, famous for its dal makhani and stuffed parathas.',
                'opening_hours' => ['Mon-Sun' => '11:00 AM - 10:30 PM'],
                'table_capacity' => 50,
                'status' => 'active',
            ],
            [
                'name' => 'Coastal Curry House',
                'location' => 'Marine Drive, Kochi',
                'cuisine' => 'Kerala Seafood',
                'image' => null,
                'price_range' => 'mid',
                'rating' => 4.5,
                'description' => 'Fresh catch-of-the-day seafood prepared in traditional Kerala style with coconut-based curries.',
                'opening_hours' => ['Mon-Sun' => '12:30 PM - 11:00 PM'],
                'table_capacity' => 35,
                'status' => 'active',
            ],
            [
                'name' => 'The Grand Thali',
                'location' => 'C-Scheme, Jaipur',
                'cuisine' => 'Rajasthani',
                'image' => null,
                'price_range' => 'premium',
                'rating' => 4.6,
                'description' => 'Unlimited royal Rajasthani thali experience served in a traditional haveli setting.',
                'opening_hours' => ['Mon-Sun' => '11:30 AM - 10:00 PM'],
                'table_capacity' => 60,
                'status' => 'active',
            ],
            [
                'name' => 'Sushi Zen',
                'location' => 'Bandra West, Mumbai',
                'cuisine' => 'Japanese',
                'image' => null,
                'price_range' => 'premium',
                'rating' => 4.4,
                'description' => 'Contemporary Japanese dining with a curated sushi and sashimi menu, plus an extensive sake list.',
                'opening_hours' => ['Mon-Sun' => '6:00 PM - 12:00 AM'],
                'table_capacity' => 25,
                'status' => 'active',
            ],
        ];

        foreach ($restaurants as $restaurant) {
            Restaurant::create($restaurant);
        }
    }
}
