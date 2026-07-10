<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\RoomType;
use Illuminate\Database\Seeder;

class RoomTypeSeeder extends Seeder
{
    public function run(): void
    {
        $roomTypes = [
            [
                'property' => 'The Grand Palace',
                'name' => 'Deluxe Room',
                'price' => 6500,
                'capacity' => 2,
                'amenities' => ['King Bed', 'AC', 'Free WiFi', 'Mini Bar'],
                'image' => 'room-1.jpg',
                'room_count' => 10,
                'status' => 'active',
            ],
            [
                'property' => 'The Grand Palace',
                'name' => 'Royal Suite',
                'price' => 12000,
                'capacity' => 4,
                'amenities' => ['King Bed', 'AC', 'Free WiFi', 'Private Balcony', 'Jacuzzi'],
                'image' => 'room-3.jpg',
                'room_count' => 4,
                'status' => 'active',
            ],
            [
                'property' => 'Backwater Bliss Resort',
                'name' => 'Lakeview Cottage',
                'price' => 8200,
                'capacity' => 2,
                'amenities' => ['Queen Bed', 'AC', 'Private Deck'],
                'image' => 'room-4.jpg',
                'room_count' => 8,
                'status' => 'active',
            ],
            [
                'property' => 'Mountain View Homestay',
                'name' => 'Standard Room',
                'price' => 2200,
                'capacity' => 3,
                'amenities' => ['Twin Beds', 'Mountain View', 'Home-cooked Meals'],
                'image' => 'room-5.jpg',
                'room_count' => 5,
                'status' => 'active',
            ],
            [
                'property' => 'Heritage Guest House',
                'name' => 'Lake View Room',
                'price' => 1800,
                'capacity' => 2,
                'amenities' => ['Double Bed', 'Lake View', 'Free WiFi'],
                'image' => 'room-6.jpg',
                'room_count' => 6,
                'status' => 'active',
            ],
            [
                'property' => 'Goa Beach Villa',
                'name' => 'Entire Villa',
                'price' => 9500,
                'capacity' => 8,
                'amenities' => ['Private Pool', 'Beach Access', 'Full Kitchen', '3 Bedrooms'],
                'image' => 'room-1.jpg',
                'room_count' => 1,
                'status' => 'active',
            ],
        ];

        foreach ($roomTypes as $roomType) {
            $property = Property::where('name', $roomType['property'])->first();

            if (!$property) {
                continue;
            }

            unset($roomType['property']);
            $roomType['property_id'] = $property->id;

            RoomType::create($roomType);
        }
    }
}
