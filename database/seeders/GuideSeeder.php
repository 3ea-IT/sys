<?php

namespace Database\Seeders;

use App\Models\Guide;
use Illuminate\Database\Seeder;

class GuideSeeder extends Seeder
{
    public function run(): void
    {
        $guides = [
            [
                'temple_id' => 1, // Ram Mandir
                'name' => 'Pandit Rajesh Sharma',
                'language' => 'Hindi',
                'description' => 'Expert temple guide with deep knowledge of Vedic rituals and temple history.',
                'image' => 'guide-1.jpg',
                'price' => 500,
                'rating' => 4.9,
                'experience' => '15 years',
                'status' => 'active',
            ],
            [
                'temple_id' => 2, // Kashi Vishwanath
                'name' => 'Acharya Deepak Tiwari',
                'language' => 'Sanskrit',
                'description' => 'Senior temple scholar with expertise in Shiva worship and spiritual practices.',
                'image' => 'guide-2.jpg',
                'price' => 750,
                'rating' => 4.9,
                'experience' => '22 years',
                'status' => 'active',
            ],
            [
                'temple_id' => 2,
                'name' => 'Priya Menon',
                'language' => 'Tamil',
                'description' => 'Multilingual translator fluent in 5 Indian languages.',
                'image' => 'guide-3.jpg',
                'price' => 350,
                'rating' => 4.7,
                'experience' => '6 years',
                'status' => 'active',
            ],
            [
                'temple_id' => 3, // Tirupati Balaji
                'name' => 'Vikram Singh',
                'language' => 'English',
                'description' => 'Family pilgrimage coordinator managing group trips with children and elders.',
                'image' => 'guide-4.jpg',
                'price' => 600,
                'rating' => 4.6,
                'experience' => '12 years',
                'status' => 'active',
            ],
            [
                'temple_id' => 4, // Mahakaleshwar
                'name' => 'Suresh Kumar',
                'language' => 'Hindi',
                'description' => 'Dedicated elderly care assistant specializing in comfortable temple visits.',
                'image' => 'guide-5.jpg',
                'price' => 400,
                'rating' => 4.8,
                'experience' => '8 years',
                'status' => 'active',
            ],
            [
                'temple_id' => 5, // Vaishno Devi
                'name' => 'Meera Devi',
                'language' => 'Hindi',
                'description' => 'Compassionate elderly care specialist with nursing background.',
                'image' => 'guide-6.jpg',
                'price' => 450,
                'rating' => 4.8,
                'experience' => '12 years',
                'status' => 'active',
            ],
        ];

        foreach ($guides as $guide) {
            Guide::create($guide);
        }
    }
}
