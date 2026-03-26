<?php

namespace Database\Seeders;

use App\Models\Cinema;
use App\Models\Movie;
use App\Models\MovieShowSlot;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CinemaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cinemas = [
            [
                'name' => 'Cinépolis',
                'location' => 'Gomti Nagar, Lucknow',
                'type' => 'multiplex',
                'total_screens' => 4,
                'latitude' => 26.8467,
                'longitude' => 80.9462,
                'description' => 'One of the most-reviewed cinemas in Gomti Nagar with premium seating and picture quality.',
                'image' => '/icons/cinema-1.png',
                'status' => 'active',
            ],
            [
                'name' => 'Wave Cinemas',
                'location' => 'The Wave Mall, Lucknow',
                'type' => 'multiplex',
                'total_screens' => 3,
                'latitude' => 26.8500,
                'longitude' => 80.9500,
                'description' => 'Multiplex at The Wave Mall with good picture quality and modern facilities.',
                'image' => '/icons/cinema-2.png',
                'status' => 'active',
            ],
            [
                'name' => 'PVR Phoenix United Mall Lucknow',
                'location' => 'Phoenix United Mall, Lucknow',
                'type' => 'multiplex',
                'total_screens' => 5,
                'latitude' => 26.8567,
                'longitude' => 80.9567,
                'description' => 'Big screens & premium experience with latest projection and sound technology.',
                'image' => '/icons/cinema-3.png',
                'status' => 'active',
            ],
            [
                'name' => 'PVR Superplex Lulu',
                'location' => 'Lulu Mall, Lucknow',
                'type' => 'multiplex',
                'total_screens' => 6,
                'latitude' => 26.8600,
                'longitude' => 80.9600,
                'description' => 'Entertainment + shopping experience with premium seating and food court.',
                'image' => '/icons/cinema-4.png',
                'status' => 'active',
            ],
            [
                'name' => 'PVR Saharaganj Lucknow',
                'location' => 'Hazratganj, Lucknow',
                'type' => 'multiplex',
                'total_screens' => 3,
                'latitude' => 26.8433,
                'longitude' => 80.9333,
                'description' => 'Popular cinema in Hazratganj area with classic and latest movies.',
                'image' => '/icons/cinema-5.png',
                'status' => 'active',
            ],
            [
                'name' => 'INOX RiverSide Mall',
                'location' => 'RiverSide Mall, Lucknow',
                'type' => 'multiplex',
                'total_screens' => 4,
                'latitude' => 26.8667,
                'longitude' => 80.9667,
                'description' => 'INOX cinema in RiverSide Mall with latest technology and comfort.',
                'image' => '/icons/cinema-6.png',
                'status' => 'active',
            ],
            [
                'name' => 'INOX Umrao Mall',
                'location' => 'Umrao Mall, Lucknow',
                'type' => 'multiplex',
                'total_screens' => 4,
                'latitude' => 26.8700,
                'longitude' => 80.9700,
                'description' => 'Another INOX screen in Umrao Mall with premium viewing experience.',
                'image' => '/icons/cinema-7.png',
                'status' => 'active',
            ],
            [
                'name' => 'Fun Cinemas',
                'location' => 'Fun Republic Mall, Lucknow',
                'type' => 'multiplex',
                'total_screens' => 3,
                'latitude' => 26.8533,
                'longitude' => 80.9533,
                'description' => 'Cinema inside Fun Republic Mall with entertainment and shopping.',
                'image' => '/icons/cinema-8.png',
                'status' => 'active',
            ],
            [
                'name' => 'Chandrama Cinema',
                'location' => 'Charbagh, Lucknow',
                'type' => 'classic',
                'total_screens' => 1,
                'latitude' => 26.8400,
                'longitude' => 80.9400,
                'description' => 'Classic theatre with vintage charm and Bollywood favorites.',
                'image' => '/icons/cinema-classic-1.png',
                'status' => 'active',
            ],
            [
                'name' => 'Rangali Cinema',
                'location' => 'Shahnajaf, Lucknow',
                'type' => 'classic',
                'total_screens' => 1,
                'latitude' => 26.8450,
                'longitude' => 80.9450,
                'description' => 'Local theatre with classic appeal and rich cinema culture.',
                'image' => '/icons/cinema-classic-2.png',
                'status' => 'active',
            ],
        ];

        // Create cinemas
        $createdCinemas = [];
        foreach ($cinemas as $cinema) {
            $createdCinemas[] = Cinema::create($cinema);
        }

        // Create movies with data in separate table
        $movies = [
            [
                'title' => 'Avatar: The Way of Water',
                'language' => 'English',
                'format' => '3D',
                'description' => 'Experience the epic adventure on Pandora.',
                'image' => '/icons/movie-1.png',
                'duration' => 192,
                'genre' => 'Science Fiction',
                'rating' => 'U',
            ],
            [
                'title' => 'Pathaan',
                'language' => 'Hindi',
                'format' => '2D',
                'description' => 'A thrilling action adventure film.',
                'image' => '/icons/movie-2.png',
                'duration' => 146,
                'genre' => 'Action',
                'rating' => 'A',
            ],
            [
                'title' => 'Oppenheimer',
                'language' => 'English',
                'format' => 'IMAX',
                'description' => 'The story of the Manhattan Project.',
                'image' => '/icons/movie-3.png',
                'duration' => 180,
                'genre' => 'Biography',
                'rating' => 'UA',
            ],
            [
                'title' => 'Jawan',
                'language' => 'Hindi',
                'format' => '2D',
                'description' => 'An action thriller film.',
                'image' => '/icons/movie-4.png',
                'duration' => 169,
                'genre' => 'Action',
                'rating' => 'A',
            ],
            [
                'title' => 'Killers of the Flower Moon',
                'language' => 'English',
                'format' => '2D',
                'description' => 'A historical crime film.',
                'image' => '/icons/movie-5.png',
                'duration' => 206,
                'genre' => 'Crime',
                'rating' => 'UA',
            ],
            [
                'title' => 'Animal',
                'language' => 'Hindi',
                'format' => '2D',
                'description' => 'A dark action thriller.',
                'image' => '/icons/movie-6.png',
                'duration' => 152,
                'genre' => 'Action',
                'rating' => 'A',
            ],
            [
                'title' => 'The Marvels',
                'language' => 'English',
                'format' => '3D',
                'description' => 'The next chapter in the superhero saga.',
                'image' => '/icons/movie-7.png',
                'duration' => 111,
                'genre' => 'Action',
                'rating' => 'UA',
            ],
            [
                'title' => 'Drishyam 2',
                'language' => 'Hindi',
                'format' => '2D',
                'description' => 'The sequel to the thrilling mystery.',
                'image' => '/icons/movie-8.png',
                'duration' => 162,
                'genre' => 'Thriller',
                'rating' => 'A',
            ],
        ];

        $createdMovies = [];
        foreach ($movies as $movie) {
            $createdMovies[] = Movie::create($movie);
        }

        // Time slots for each day
        $timeSlots = [
            '10:00', '12:30', '15:00', '17:30', '20:00', '22:30'
        ];

        // Create movie show slots for next 7 days
        foreach ($createdCinemas as $cinema) {
            for ($dayOffset = 0; $dayOffset < 7; $dayOffset++) {
                $showDate = now()->addDays($dayOffset)->toDateString();
                
                foreach ($timeSlots as $index => $time) {
                    $movie = $createdMovies[($dayOffset * count($timeSlots) + $index) % count($createdMovies)];
                    $totalSeats = rand(100, 200);
                    $availableSeats = rand(10, $totalSeats);

                    MovieShowSlot::create([
                        'cinema_id' => $cinema->id,
                        'movie_id' => $movie->id,
                        'screen_name' => 'Screen ' . ($index % 3 + 1),
                        'show_date' => $showDate,
                        'show_time' => $showDate . ' ' . $time . ':00',
                        'show_end_time' => $showDate . ' ' . date('H:i:s', strtotime($time) + 10800), // 3 hours duration
                        'total_seats' => $totalSeats,
                        'available_seats' => $availableSeats,
                        'price' => rand(200, 500),
                        'status' => $availableSeats > 0 ? 'active' : 'sold_out',
                    ]);
                }
            }
        }
    }
}
