<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TempleController extends Controller
{
    /**
     * Display the temples index page
     */
    public function index()
    {
        // TODO: Fetch temples from database
        $temples = [
            [
                'id' => 1,
                'name' => 'Kashi Vishwanath',
                'location' => 'Varanasi, Uttar Pradesh',
                'image' => '/banner/Kashi-temple-1.jpg',
                'rating' => 4.9,
                'crowd_level' => 'Moderate',
                'has_vip_darshan' => true,
                'instant_price' => 100,
                'hold_token' => 50,
            ],
            [
                'id' => 2,
                'name' => 'Ram Mandir',
                'location' => 'Ayodhya, Uttar Pradesh',
                'image' => '/banner/Ram_Mandir.jpg',
                'rating' => 4.8,
                'crowd_level' => 'High',
                'has_vip_darshan' => true,
                'instant_price' => 150,
                'hold_token' => 75,
            ],
            [
                'id' => 3,
                'name' => 'Tirupati Balaji',
                'location' => 'Tirupati, Andhra Pradesh',
                'image' => '/banner/tirupati-balaji.jpg',
                'rating' => 4.7,
                'crowd_level' => 'High',
                'has_vip_darshan' => true,
                'instant_price' => 200,
                'hold_token' => 100,
            ],
            [
                'id' => 4,
                'name' => 'Mahakaleswar Jyotirling',
                'location' => 'Ujjain, Madhya Pradesh',
                'image' => '/banner/mahakaleshwar.jpg',
                'rating' => 4.6,
                'crowd_level' => 'Moderate',
                'has_vip_darshan' => false,
                'instant_price' => 80,
                'hold_token' => 40,
            ],
            [
                'id' => 5,
                'name' => 'Vaishno Devi',
                'location' => 'Katra, Jammu & Kashmir',
                'image' => '/banner/vaishano-devi-1.png',
                'rating' => 4.8,
                'crowd_level' => 'Low',
                'has_vip_darshan' => true,
                'instant_price' => 120,
                'hold_token' => 60,
            ],
        ];

        $festivals = [
            [
                'id' => 1,
                'name' => 'Maha Shivaratri',
                'location' => 'Kashi Vishwanath',
                'image' => '/banner/festival-1.jpeg',
                'crowd_level' => 'Very High',
                'date' => '2026-02-15',
            ],
            [
                'id' => 2,
                'name' => 'Ram Navami',
                'location' => 'Ram Mandir',
                'image' => '/banner/festival-2.webp',
                'crowd_level' => 'High',
                'date' => '2026-03-29',
            ],
            [
                'id' => 3,
                'name' => 'Ganesh Chaturthi',
                'location' => 'Siddhi Vinayak',
                'image' => '/banner/festival-3.jpg',
                'crowd_level' => 'Extreme',
                'date' => '2026-08-30',
            ],
        ];

        $vipDarshans = [
            [
                'id' => 1,
                'temple_id' => 1,
                'temple_name' => 'Kashi Vishwanath',
                'description' => 'Priority Access - 15 min wait',
                'image' => '/banner/Kashi-temple-1.jpg',
                'price' => 250,
            ],
            [
                'id' => 2,
                'temple_id' => 2,
                'temple_name' => 'Ram Mandir',
                'description' => 'VIP Express - 5 min wait',
                'image' => '/banner/Ram_Mandir.jpg',
                'price' => 500,
            ],
            [
                'id' => 3,
                'temple_id' => 3,
                'temple_name' => 'Tirupati Balaji',
                'description' => 'Premium Access - Direct Darshan',
                'image' => '/banner/tirupati-balaji.jpg',
                'price' => 1000,
            ],
        ];

        return Inertia::render('Temple/Index', [
            'temples' => $temples,
            'festivals' => $festivals,
            'vipDarshans' => $vipDarshans,
            'userLocation' => 'Lucknow, UP', // TODO: Get from user location
        ]);
    }

    /**
     * Display a specific temple
     */
    public function show($id)
    {
        // ── DYNAMIC CARD MATCHING LOOKUP TREE ─────────────────────────────────
        $allTemples = [
            1 => [
                'id' => 1,
                'name' => 'Kashi Vishwanath',
                'location' => 'Varanasi, Uttar Pradesh',
                'image' => '/banner/Kashi-temple-1.jpg',
                'rating' => 4.9,
                'crowd_level' => 'Moderate',
                'has_vip_darshan' => true,
                'description' => 'One of the most sacred and ancient temples in India. Experience the divine spirituality and participate in age-old rituals and ceremonies.',
                'amenities' => ['Parking', 'Restrooms', 'Prasad Counter', 'Lockers', 'Food Court', 'Gift Shop'],
                'timings' => [
                    ['name' => 'Morning Darshan', 'time' => '5:00 AM - 10:00 AM', 'type' => 'Regular'],
                    ['name' => 'Afternoon Darshan', 'time' => '12:00 PM - 3:00 PM', 'type' => 'Regular'],
                    ['name' => 'Evening Aarti', 'time' => '6:00 PM - 7:00 PM', 'type' => 'Special'],
                    ['name' => 'Night Darshan', 'time' => '8:00 PM - 11:00 PM', 'type' => 'Regular'],
                ],
                'reviews' => [
                    ['name' => 'Priya Sharma', 'rating' => 5, 'text' => 'Amazing spiritual experience! Very peaceful and well-maintained.', 'date' => '2 days ago'],
                    ['name' => 'Rajesh Kumar', 'rating' => 5, 'text' => 'The VIP darshan service was excellent. Highly recommended!', 'date' => '1 week ago'],
                    ['name' => 'Anjali Patel', 'rating' => 4, 'text' => 'Beautiful temple with great atmosphere. Parking could be better.', 'date' => '2 weeks ago'],
                ],
                'regular_price' => 100,
                'vip_price' => 250,
                'daily_slots' => 500,
                'avg_wait' => '30 min',
                'total_reviews' => 1200,
            ],
            2 => [
                'id' => 2,
                'name' => 'Ram Mandir',
                'location' => 'Ayodhya, Uttar Pradesh',
                'image' => '/banner/Ram_Mandir.jpg',
                'rating' => 4.8,
                'crowd_level' => 'High',
                'has_vip_darshan' => true,
                'description' => 'Experience the grand majesty of Lord Ram’s sacred birthplace. Witness beautiful traditional architectures, sacred spires, and continuous morning devotional chants.',
                'amenities' => ['Prasad Counter', 'Restrooms', 'Lockers', 'Food Court', 'Medical Desk'],
                'timings' => [
                    ['name' => 'Aarti & Darshan', 'time' => '6:30 AM - 12:00 PM', 'type' => 'Regular'],
                    ['name' => 'Bhog Distribution', 'time' => '12:30 PM - 1:30 PM', 'type' => 'Special'],
                    ['name' => 'Evening Darshan', 'time' => '2:00 PM - 10:00 PM', 'type' => 'Regular'],
                ],
                'reviews' => [
                    ['name' => 'Aman Verma', 'rating' => 5, 'text' => 'The grandeur of this place is absolutely out of this world!', 'date' => '1 day ago'],
                    ['name' => 'Sita Reddy', 'rating' => 5, 'text' => 'Unbelievably serene infrastructure. Very clean lines and queues.', 'date' => '3 days ago'],
                ],
                'regular_price' => 150,
                'vip_price' => 500,
                'daily_slots' => 1000,
                'avg_wait' => '90 min',
                'total_reviews' => 3500,
            ],
            3 => [
                'id' => 3,
                'name' => 'Tirupati Balaji',
                'location' => 'Tirupati, Andhra Pradesh',
                'image' => '/banner/tirupati-balaji.jpg',
                'rating' => 4.7,
                'crowd_level' => 'High',
                'has_vip_darshan' => true,
                'description' => 'The world-famous shrine of Lord Venkateswara nestled in Tirumala hills. Experience intense devotion, massive scale distribution of sacred Laddus, and iconic architecture structures.',
                'amenities' => ['Food Court', 'Restrooms', 'Lockers', 'Gift Shop', 'Stay Counter', 'Free Transit'],
                'timings' => [
                    ['name' => 'Sarvadarsanam', 'time' => 'Open 24 Hours', 'type' => 'Regular'],
                    ['name' => 'Special Entry Darshan', 'time' => 'By Pre-booked Slots Only', 'type' => 'Special'],
                ],
                'reviews' => [
                    ['name' => 'Kiran Kumar', 'rating' => 5, 'text' => 'Extremely well organized administration despite handling massive crowd levels.', 'date' => '3 weeks ago'],
                ],
                'regular_price' => 200,
                'vip_price' => 1000,
                'daily_slots' => 2500,
                'avg_wait' => '180 min',
                'total_reviews' => 8900,
            ],
            4 => [
                'id' => 4,
                'name' => 'Mahakaleshwar Jyotirlinga',
                'location' => 'Ujjain, Madhya Pradesh',
                'image' => '/banner/mahakaleshwar.jpg',
                'rating' => 4.6,
                'crowd_level' => 'Moderate',
                'has_vip_darshan' => false,
                'description' => 'One of the twelve revered Jyotirlingas of Lord Shiva. Experience the legendary early-morning Bhasma Aarti and feel the profound cosmic spiritual energy across the temple corridors.',
                'amenities' => ['Parking', 'Restrooms', 'Prasad Counter', 'Lockers', 'Cloakroom'],
                'timings' => [
                    ['name' => 'Bhasma Aarti', 'time' => '4:00 AM - 6:00 AM', 'type' => 'Special'],
                    ['name' => 'General Darshan', 'time' => '6:00 AM - 10:00 PM', 'type' => 'Regular'],
                ],
                'reviews' => [
                    ['name' => 'Sanjay Mishra', 'rating' => 5, 'text' => 'Attending the morning Bhasma Aarti was completely life-changing.', 'date' => '5 days ago'],
                ],
                'regular_price' => 80,
                'vip_price' => 150,
                'daily_slots' => 800,
                'avg_wait' => '20 min',
                'total_reviews' => 4400,
            ],
            5 => [
                'id' => 5,
                'name' => 'Vaishno Devi',
                'location' => 'Katra, Jammu & Kashmir',
                'image' => '/banner/vaishano-devi-1.png',
                'rating' => 4.8,
                'crowd_level' => 'Low',
                'has_vip_darshan' => true,
                'description' => 'A holy cave shrine situated amidst the beautiful Trikuta Mountains. Embark on a rewarding spiritual trek culminating in peaceful, divine darshan of the natural rock formations (Pindies).',
                'amenities' => ['Medical Counters', 'Restrooms', 'Blanket Stores', 'Food Outlets', 'Helipad Access'],
                'timings' => [
                    ['name' => 'Holy Cave Open', 'time' => 'Open 24 Hours', 'type' => 'Regular'],
                    ['name' => 'Atka Aarti Session', 'time' => '6:00 AM & 7:00 PM', 'type' => 'Special'],
                ],
                'reviews' => [
                    ['name' => 'Meena Dev', 'rating' => 5, 'text' => 'The trek is tough but the ultimate darshan makes everything feel light and magical.', 'date' => '4 days ago'],
                ],
                'regular_price' => 120,
                'vip_price' => 600,
                'daily_slots' => 1500,
                'avg_wait' => '60 min',
                'total_reviews' => 6200,
            ],
            6 => [
                'id' => 6,
                'name' => 'Shirdi Sai Baba',
                'location' => 'Shirdi, Maharashtra',
                'image' => '/banner/sai-baba.jpg',
                'rating' => 4.7,
                'crowd_level' => 'Moderate',
                'has_vip_darshan' => true,
                'description' => 'Experience the divine blessings at the sacred abode of Shirdi Sai Baba. A place of spiritual peace and miraculous healing where devotees from across the world seek solace and divine intervention.',
                'amenities' => ['Parking', 'Restrooms', 'Prasad Counter', 'Lockers', 'Food Court', 'Rest House'],
                'timings' => [
                    ['name' => 'Morning Aarti', 'time' => '5:30 AM - 7:00 AM', 'type' => 'Special'],
                    ['name' => 'Morning Darshan', 'time' => '7:00 AM - 12:00 PM', 'type' => 'Regular'],
                    ['name' => 'Afternoon Darshan', 'time' => '1:00 PM - 5:00 PM', 'type' => 'Regular'],
                    ['name' => 'Evening Aarti', 'time' => '5:30 PM - 6:30 PM', 'type' => 'Special'],
                ],
                'reviews' => [
                    ['name' => 'Rakesh Sharma', 'rating' => 5, 'text' => 'A truly spiritual place. Felt blessed after the darshan. Very peaceful atmosphere.', 'date' => '1 week ago'],
                    ['name' => 'Neha Patel', 'rating' => 5, 'text' => 'The experience was life-changing. Highly recommend visiting with devotion.', 'date' => '10 days ago'],
                    ['name' => 'Vikram Singh', 'rating' => 5, 'text' => 'Sai Baba temple is a divine sanctuary. The devotion here is unmatched.', 'date' => '2 weeks ago'],
                ],
                'regular_price' => 110,
                'vip_price' => 350,
                'daily_slots' => 400,
                'avg_wait' => '50 min',
                'total_reviews' => 2100,
            ]
        ];

        // Explicitly cast dynamic parameter value to an integer map index
        $templeId = (int)$id;

        // Perform lookups on container data maps or fall back to array entry index 1
        $temple = $allTemples[$templeId] ?? $allTemples[1];

        return Inertia::render('Temple/Show', [
            'temple' => $temple,
        ]);
    }

    /**
     * Display temple booking page (list of temples)
     */
    public function book()
    {
        // TODO: Fetch temples from database
        $temples = [
            [
                'id' => 1,
                'name' => 'Kashi Vishwanath',
                'location' => 'Varanasi, Uttar Pradesh',
                'image' => '/banner/Kashi-temple-1.jpg',
                'rating' => 4.9,
                'crowd_level' => 'Moderate',
                'has_vip_darshan' => true,
                'avg_wait' => '45 min',
                'regular_price' => 100,
                'opening_info' => 'Open Daily',
            ],
            [
                'id' => 2,
                'name' => 'Ram Mandir',
                'location' => 'Ayodhya, Uttar Pradesh',
                'image' => '/banner/Ram_Mandir.jpg',
                'rating' => 4.8,
                'crowd_level' => 'High',
                'has_vip_darshan' => true,
                'avg_wait' => '90 min',
                'regular_price' => 150,
                'opening_info' => 'Open Daily',
                'special_event' => 'Ram Navami',
            ],
            [
                'id' => 3,
                'name' => 'Tirupati Balaji',
                'location' => 'Tirupati, Andhra Pradesh',
                'image' => '/banner/tirupati-balaji.jpg',
                'rating' => 4.7,
                'crowd_level' => 'High',
                'has_vip_darshan' => true,
                'avg_wait' => '180 min',
                'regular_price' => 200,
                'opening_info' => 'Open Daily',
            ],
            [
                'id' => 4,
                'name' => 'Mahakaleswar Jyotirling',
                'location' => 'Ujjain, Madhya Pradesh',
                'image' => '/banner/mahakaleshwar.jpg',
                'rating' => 4.6,
                'crowd_level' => 'Moderate',
                'has_vip_darshan' => false,
                'avg_wait' => '20 min',
                'regular_price' => 80,
                'opening_info' => 'Open Daily',
            ],
            [
                'id' => 5,
                'name' => 'Vaishno Devi',
                'location' => 'Katra, Jammu & Kashmir',
                'image' => '/banner/vaishano-devi-1.png',
                'rating' => 4.8,
                'crowd_level' => 'Low',
                'has_vip_darshan' => true,
                'avg_wait' => '60 min',
                'regular_price' => 120,
                'opening_info' => 'Open Daily',
            ],
            [
                'id' => 6,
                'name' => 'Shirdi Sai Baba',
                'location' => 'Shirdi, Maharashtra',
                'image' => '/banner/sai-baba.jpg',
                'rating' => 4.7,
                'crowd_level' => 'Moderate',
                'has_vip_darshan' => true,
                'avg_wait' => '50 min',
                'regular_price' => 110,
                'opening_info' => 'Open Daily',
            ],
        ];

        return Inertia::render('Temple/Book', [
            'temples' => $temples,
        ]);
    }

    /**
     * Display booking confirmation page for specific temple
     */
    public function bookConfirm($id)
    {
        // TODO: Fetch temple by ID from database
        $temple = [
            'id' => $id,
            'name' => 'Kashi Vishwanath',
            'location' => 'Varanasi, Uttar Pradesh',
            'image' => '/banner/Kashi-temple-1.jpg',
            'rating' => 4.9,
            'regular_price' => 100,
            'vip_price' => 250,
        ];

        return Inertia::render('Temple/BookConfirm', [
            'temple' => $temple,
        ]);
    }

    /**
     * Display festivals page
     */
    public function festivalShow($id)
    {
        $festivals = [
            1 => [
                'id' => 1,
                'name' => 'Maha Shivaratri',
                'location' => 'Kashi Vishwanath',
                'image' => '/banner/festival-1.jpeg',
                'crowd_level' => 'Very High',
                'date' => '2026-02-15',
                'description' => 'Night-long Shiva worship with special Aarti.',
            ],
            2 => [
                'id' => 2,
                'name' => 'Ram Navami',
                'location' => 'Ram Mandir',
                'image' => '/banner/festival-2.webp',
                'crowd_level' => 'High',
                'date' => '2026-03-29',
                'description' => 'Birth celebration of Lord Ram.',
            ],
            3 => [
                'id' => 3,
                'name' => 'Ganesh Chaturthi',
                'location' => 'Siddhi Vinayak',
                'image' => '/banner/festival-3.jpg',
                'crowd_level' => 'Extreme',
                'date' => '2026-08-30',
                'description' => 'Ganesh idol celebration and visarjan.',
            ],
        ];

        // Explicitly cast to integer to ensure array index lookups hit flawlessly
        $festivalId = (int)$id;
        $festival = $festivals[$festivalId] ?? null;

        if (!$festival) {
            abort(404);
        }

        // 🌟 FIXED: Target the exact Temple directory structure folder path
        return Inertia::render('Temple/FestivalShow', [
            'festival' => $festival
        ]);
    }

    /**
     * Display VIP darshan page
     */
    public function vip()
    {
        $vipDarshans = [
            [
                'id' => 1,
                'temple_name' => 'Ram Mandir',
                'location' => 'Ayodhya, UP',
                'image' => '/banner/Ram_Mandir.jpg',
                'rating' => 4.9,
                'reviews' => 342,
                'vip_price' => 2500,
                'regular_price' => 500,
                'duration' => '2 hours',
                'includes' => ['Priority Entry', 'Dedicated Guide', 'Puja Participation'],
                'available' => true,
            ],
            [
                'id' => 2,
                'temple_name' => 'Kashi Vishwanath',
                'location' => 'Varanasi, UP',
                'image' => '/banner/Kashi-temple-1.jpg',
                'rating' => 4.8,
                'reviews' => 521,
                'vip_price' => 3000,
                'regular_price' => 500,
                'duration' => '3 hours',
                'includes' => ['Priority Entry', 'Ghat Access', 'Aarti Viewing'],
                'available' => true,
            ],
            [
                'id' => 3,
                'temple_name' => 'Tirupati Balaji',
                'location' => 'Tirupati, AP',
                'image' => '/banner/tirupati-balaji.jpg',
                'rating' => 4.7,
                'reviews' => 897,
                'vip_price' => 2000,
                'regular_price' => 300,
                'duration' => '1.5 hours',
                'includes' => ['Direct Entry', 'Special Darshan', 'Prasad'],
                'available' => true,
            ],
            [
                'id' => 4,
                'temple_name' => 'Vaishno Devi',
                'location' => 'Katra, J&K',
                'image' => '/banner/vaishano-devi-1.png',
                'rating' => 4.6,
                'reviews' => 634,
                'vip_price' => 4500,
                'regular_price' => 0,
                'duration' => '4 hours',
                'includes' => ['Quick Route Access', 'Helicopter Option', 'Meals'],
                'available' => true,
            ],
            [
                'id' => 5,
                'temple_name' => 'Mahakal Ujjain',
                'location' => 'Ujjain, MP',
                'image' => '/banner/mahakaleshwar.jpg',
                'rating' => 4.5,
                'reviews' => 445,
                'vip_price' => 1500,
                'regular_price' => 300,
                'duration' => '1 hour',
                'includes' => ['Reserved Area', 'Priest Blessing', 'Prasad'],
                'available' => true,
            ],
            [
                'id' => 6,
                'temple_name' => 'Shirdi Sai Baba',
                'location' => 'Shirdi, Maharashtra',
                'image' => '/banner/sai-baba.jpg',
                'rating' => 4.7,
                'reviews' => 512,
                'vip_price' => 1800,
                'regular_price' => 350,
                'duration' => '2 hours',
                'includes' => ['Priority Entry', 'Dedicated Guide', 'Aarti Participation'],
                'available' => true,
            ],
        ];

        return Inertia::render('Temple/Vip', [
            'vipDarshans' => $vipDarshans,
        ]);
    }

    /**
     * Display VIP Darshan detail page
     */
    public function vipDetail($id)
    {
        $vipDarshans = [
            1 => [
                'id' => 1,
                'temple_name' => 'Ram Mandir',
                'location' => 'Ayodhya, UP',
                'image' => '/banner/Ram_Mandir.jpg',
                'rating' => 4.9,
                'reviews' => 342,
                'total_reviews' => 1500,
                'vip_price' => 2500,
                'regular_price' => 500,
                'duration' => '2 hours',
                'includes' => ['Priority Entry', 'Dedicated Guide', 'Puja Participation', 'Prasad Distribution'],
                'available' => true,
                'max_slots_daily' => 150,
                'avg_wait_time' => '15 minutes',
                'description' => 'Experience the divine atmosphere of Ram Mandir with priority access and a dedicated guide. Participate in sacred puja ceremonies and receive blessed prasad.',
                'highlights' => [
                    'Direct entry without standing in long queues',
                    'Expert guide to explain temple history and rituals',
                    'Participate in sacred Puja ceremonies',
                    'Exclusive access to special darshan areas',
                    'Traditional Prasad distribution by temple authorities'
                ],
                'what_to_expect' => 'A 2-hour spiritual journey including temple entry, guided darshan, puja participation, and prasad distribution. You will be guided through the sacred areas of the temple with insights into its architectural and religious significance.',
                'best_time' => 'Early morning (6:30 AM - 10:00 AM) for peaceful experience',
                'amenities' => ['Parking', 'Restrooms', 'Locker Facilities', 'Prasad Counter', 'Medical Aid'],
                'timings' => [
                    ['slot' => 'Morning', 'time' => '6:30 AM - 10:00 AM', 'status' => 'Available'],
                    ['slot' => 'Midday', 'time' => '12:00 PM - 3:00 PM', 'status' => 'Limited'],
                    ['slot' => 'Evening', 'time' => '5:00 PM - 8:00 PM', 'status' => 'Available'],
                ]
            ],
            2 => [
                'id' => 2,
                'temple_name' => 'Kashi Vishwanath',
                'location' => 'Varanasi, UP',
                'image' => '/banner/Kashi-temple-1.jpg',
                'rating' => 4.8,
                'reviews' => 521,
                'total_reviews' => 2200,
                'vip_price' => 3000,
                'regular_price' => 500,
                'duration' => '3 hours',
                'includes' => ['Priority Entry', 'Ghat Access', 'Aarti Viewing', 'Boat Ride', 'Prasad'],
                'available' => true,
                'max_slots_daily' => 200,
                'avg_wait_time' => '20 minutes',
                'description' => 'Immerse yourself in the spiritual energy of Kashi Vishwanath with our exclusive VIP package. Enjoy priority access, ghat exploration, and witness the mesmerizing Aarti.',
                'highlights' => [
                    'VIP entry to the holiest temple in India',
                    'Private boat ride on the sacred Ganges River',
                    'Witness the grand evening Aarti ceremony',
                    'Access to premium ghat areas',
                    'Guided tour through ancient temple lanes'
                ],
                'what_to_expect' => 'A 3-hour immersive experience combining temple darshan, ghat exploration, boat ride on Ganges, and evening Aarti. Our guide will share deep spiritual insights and cultural significance.',
                'best_time' => 'Evening (6:00 PM - 8:00 PM) for Aarti viewing',
                'amenities' => ['Parking', 'Restrooms', 'Lockers', 'Food Court', 'Guide Service'],
                'timings' => [
                    ['slot' => 'Morning', 'time' => '5:00 AM - 8:00 AM', 'status' => 'Available'],
                    ['slot' => 'Afternoon', 'time' => '12:00 PM - 3:00 PM', 'status' => 'Available'],
                    ['slot' => 'Evening', 'time' => '6:00 PM - 9:00 PM', 'status' => 'Full'],
                ]
            ],
            3 => [
                'id' => 3,
                'temple_name' => 'Tirupati Balaji',
                'location' => 'Tirupati, AP',
                'image' => '/banner/tirupati-balaji.jpg',
                'rating' => 4.7,
                'reviews' => 897,
                'total_reviews' => 4100,
                'vip_price' => 2000,
                'regular_price' => 300,
                'duration' => '1.5 hours',
                'includes' => ['Direct Entry', 'Special Darshan', 'Prasad', 'Laddu Offering'],
                'available' => true,
                'max_slots_daily' => 300,
                'avg_wait_time' => '10 minutes',
                'description' => 'Experience the blessings of Lord Venkateswara at the world-famous Tirupati Balaji temple with VIP darshan privileges.',
                'highlights' => [
                    'Direct entry without regular queue',
                    'Special darshan of the deity',
                    'Famous Tirupati Laddus',
                    'Air-conditioned waiting areas',
                    'Professional darshan coordination'
                ],
                'what_to_expect' => 'Skip the regular queues and enjoy swift darshan with all facilities. Receive blessed prasad including the famous Tirupati Laddus, known worldwide.',
                'best_time' => 'Any time - open 24 hours',
                'amenities' => ['Food Court', 'Restrooms', 'Medical Counter', 'Gift Shop', 'Prasad Counter'],
                'timings' => [
                    ['slot' => 'Early Morning', 'time' => '6:00 AM - 10:00 AM', 'status' => 'Available'],
                    ['slot' => 'Daytime', 'time' => '10:00 AM - 5:00 PM', 'status' => 'Available'],
                    ['slot' => 'Evening', 'time' => '5:00 PM - 10:00 PM', 'status' => 'Available'],
                ]
            ],
            4 => [
                'id' => 4,
                'temple_name' => 'Vaishno Devi',
                'location' => 'Katra, J&K',
                'image' => '/banner/vaishano-devi-1.png',
                'rating' => 4.6,
                'reviews' => 634,
                'total_reviews' => 3200,
                'vip_price' => 4500,
                'regular_price' => 0,
                'duration' => '4 hours',
                'includes' => ['Quick Route Access', 'Helicopter Option', 'Meals', 'Rest Stop', 'Guide Support'],
                'available' => true,
                'max_slots_daily' => 100,
                'avg_wait_time' => '30 minutes',
                'description' => 'Make your pilgrimage to the holy cave shrine of Vaishno Devi with premium VIP services including helicopter option and professional support.',
                'highlights' => [
                    'Quick pony or helicopter route option',
                    'Professional guide throughout the journey',
                    'Meals and refreshments provided',
                    'Rest stops with facilities',
                    'Medical support available'
                ],
                'what_to_expect' => '4-hour guided pilgrimage with options for trek or helicopter ride. Experience the spiritual journey to the holy cave with all modern conveniences.',
                'best_time' => 'Spring (March-May) or Autumn (September-October)',
                'amenities' => ['Medical Counters', 'Rest Rooms', 'Food Outlets', 'Helicopter Pad', 'Guide Service'],
                'timings' => [
                    ['slot' => 'Morning', 'time' => '6:00 AM - 9:00 AM', 'status' => 'Available'],
                    ['slot' => 'Afternoon', 'time' => '11:00 AM - 2:00 PM', 'status' => 'Limited'],
                    ['slot' => 'Evening', 'time' => '3:00 PM - 6:00 PM', 'status' => 'Available'],
                ]
            ],
            5 => [
                'id' => 5,
                'temple_name' => 'Mahakal Ujjain',
                'location' => 'Ujjain, MP',
                'image' => '/banner/mahakaleshwar.jpg',
                'rating' => 4.5,
                'reviews' => 445,
                'total_reviews' => 1800,
                'vip_price' => 1500,
                'regular_price' => 300,
                'duration' => '1 hour',
                'includes' => ['Reserved Area', 'Priest Blessing', 'Prasad', 'Special Aarti'],
                'available' => true,
                'max_slots_daily' => 250,
                'avg_wait_time' => '5 minutes',
                'description' => 'Seek blessings at the sacred Mahakal temple with VIP access and special rituals.',
                'highlights' => [
                    'Reserved seating area',
                    'One-on-one priest blessing',
                    'Special Aarti participation',
                    'Premium prasad',
                    'Spiritual consultation'
                ],
                'what_to_expect' => '1-hour session with reserved seating, direct priest interaction, and spiritual guidance.',
                'best_time' => 'Early morning for Bhasma Aarti experience',
                'amenities' => ['Parking', 'Restrooms', 'Prasad Counter', 'Cloakroom', 'Guide'],
                'timings' => [
                    ['slot' => 'Bhasma Aarti', 'time' => '4:00 AM - 6:00 AM', 'status' => 'Limited'],
                    ['slot' => 'Morning', 'time' => '6:00 AM - 12:00 PM', 'status' => 'Available'],
                    ['slot' => 'Evening', 'time' => '5:00 PM - 9:00 PM', 'status' => 'Available'],
                ]
            ],
            6 => [
                'id' => 6,
                'temple_name' => 'Shirdi Sai Baba',
                'location' => 'Shirdi, Maharashtra',
                'image' => '/banner/sai-baba.jpg',
                'rating' => 4.7,
                'reviews' => 512,
                'total_reviews' => 2100,
                'vip_price' => 1800,
                'regular_price' => 350,
                'duration' => '2 hours',
                'includes' => ['Priority Entry', 'Dedicated Guide', 'Aarti Participation', 'Prasad Distribution'],
                'available' => true,
                'max_slots_daily' => 120,
                'avg_wait_time' => '15 minutes',
                'description' => 'Experience divine blessings at Shirdi Sai Baba temple with VIP access and spiritual guidance.',
                'highlights' => [
                    'Priority entry with dedicated guide',
                    'Participate in sacred Aarti ceremonies',
                    'Direct access to prayer halls',
                    'Special interaction with temple priests',
                    'Authentic Sai Baba Prasad'
                ],
                'what_to_expect' => '2-hour spiritual journey including temple entry, guided experience, aarti participation, and divine blessings.',
                'best_time' => 'Early morning (5:00 AM - 7:00 AM) for morning Aarti',
                'amenities' => ['Parking', 'Restrooms', 'Prasad Counter', 'Lockers', 'Food Court', 'Rest House'],
                'timings' => [
                    ['slot' => 'Morning Aarti', 'time' => '5:30 AM - 7:00 AM', 'status' => 'Available'],
                    ['slot' => 'Morning Darshan', 'time' => '7:00 AM - 12:00 PM', 'status' => 'Available'],
                    ['slot' => 'Evening Aarti', 'time' => '5:30 PM - 6:30 PM', 'status' => 'Limited'],
                ]
            ]
        ];

        $vipDetail = $vipDarshans[$id] ?? $vipDarshans[1];

        return Inertia::render('Temple/VipDetail', [
            'vip' => $vipDetail,
        ]);
    }
}