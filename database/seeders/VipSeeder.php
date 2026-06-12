<?php

namespace Database\Seeders;

use App\Models\Vip;
use Illuminate\Database\Seeder;

class VipSeeder extends Seeder
{
    public function run(): void
    {
        $vips = [
            [
                'temple_id' => 1, // Ram Mandir
                'name' => 'VIP Darshan Package',
                'description' => 'Priority access to the main sanctum with skip-the-line service.',
                'image' => 'p1.jpg',
                'price' => 250,
                'duration' => '45 minutes',
                'benefits' => 'Priority queue, Direct darshan access, Separate VIP line, Premium seating area',
                'status' => 'active',
            ],
            [
                'temple_id' => 1,
                'name' => 'Royal VIP Experience',
                'description' => 'Complete VIP experience with guide and special rituals.',
                'image' => 'p2.png',
                'price' => 500,
                'duration' => '2 hours',
                'benefits' => 'Priority queue, Private guide, Ritual participation, Photography allowed, Premium seating',
                'status' => 'active',
            ],
            [
                'temple_id' => 2, // Kashi Vishwanath
                'name' => 'Kashi VIP Darshan',
                'description' => 'Priority darshan with spiritual guidance at Kashi Vishwanath.',
                'image' => 'p3.png',
                'price' => 300,
                'duration' => '1 hour',
                'benefits' => 'Skip main queue, Expert guide, Ritual blessings, Prasad included',
                'status' => 'active',
            ],
            [
                'temple_id' => 3, // Tirupati Balaji
                'name' => 'Tirupati VIP Darshan',
                'description' => 'Premium VIP access at Tirupati Balaji temple with private arrangement.',
                'image' => 'p4.png',
                'price' => 400,
                'duration' => '1.5 hours',
                'benefits' => 'Priority entry, Special aarti, Prasad meal, Transportation assistance',
                'status' => 'active',
            ],
            [
                'temple_id' => 4, // Mahakaleshwar
                'name' => 'Mahakal VIP Package',
                'description' => 'VIP access to Mahakaleshwar Jyotirlinga with ritual participation.',
                'image' => 'p-5.jpg',
                'price' => 350,
                'duration' => '1.5 hours',
                'benefits' => 'Quick queue, Sacred aarti, Ritual bathing, Expert commentary',
                'status' => 'active',
            ],
            [
                'temple_id' => 5, // Vaishno Devi
                'name' => 'Vaishno Devi Premium Package',
                'description' => 'Premium package for comfortable Vaishno Devi visit.',
                'image' => 'p-6.jpg',
                'price' => 600,
                'duration' => '4 hours',
                'benefits' => 'Porter assistance, Comfortable route, Rest facilities, Meal included',
                'status' => 'active',
            ],
        ];

        foreach ($vips as $vip) {
            Vip::create($vip);
        }
    }
}
