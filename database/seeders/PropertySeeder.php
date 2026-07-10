<?php

namespace Database\Seeders;

use App\Models\Property;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        $properties = [
            [
                'name' => 'The Grand Palace',
                'type' => 'Hotel',
                'location' => 'Jaipur, Rajasthan',
                'image' => null,
                'price_per_night' => 6500,
                'rating' => 4.6,
                'amenities' => ['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Airport Shuttle'],
                'description' => 'A luxury heritage hotel blending royal Rajasthani architecture with modern comforts.',
                'status' => 'active',
            ],
            [
                'name' => 'Backwater Bliss Resort',
                'type' => 'Resort',
                'location' => 'Alleppey, Kerala',
                'image' => null,
                'price_per_night' => 8200,
                'rating' => 4.7,
                'amenities' => ['Houseboat Access', 'Free WiFi', 'Ayurvedic Spa', 'Restaurant'],
                'description' => 'A serene backwater resort with private houseboat access and Ayurvedic wellness treatments.',
                'status' => 'active',
            ],
            [
                'name' => 'Mountain View Homestay',
                'type' => 'Homestay',
                'location' => 'Manali, Himachal Pradesh',
                'image' => null,
                'price_per_night' => 2200,
                'rating' => 4.5,
                'amenities' => ['Home-cooked Meals', 'Bonfire', 'Mountain View', 'Free WiFi'],
                'description' => 'A cozy family-run homestay with panoramic Himalayan views and authentic local hospitality.',
                'status' => 'active',
            ],
            [
                'name' => 'Heritage Guest House',
                'type' => 'Guest House',
                'location' => 'Udaipur, Rajasthan',
                'image' => null,
                'price_per_night' => 1800,
                'rating' => 4.2,
                'amenities' => ['Lake View', 'Free WiFi', 'Rooftop Cafe'],
                'description' => 'A budget-friendly guest house with a rooftop cafe overlooking Lake Pichola.',
                'status' => 'active',
            ],
            [
                'name' => 'Goa Beach Villa',
                'type' => 'Vacation Rental',
                'location' => 'Candolim, Goa',
                'image' => null,
                'price_per_night' => 9500,
                'rating' => 4.8,
                'amenities' => ['Private Pool', 'Beach Access', 'Free WiFi', 'Kitchen'],
                'description' => 'A private beachfront villa with a plunge pool, ideal for family getaways and group stays.',
                'status' => 'active',
            ],
        ];

        foreach ($properties as $property) {
            Property::create($property);
        }
    }
}
