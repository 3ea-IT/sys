<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IplMatchesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   
   public function run()
    {
        DB::table('ipl_matches')->insert([
        [
            'team1_id' => 9, // RCB
            'team2_id' => 10, // SRH
            'match_date' => '2026-03-28',
            'match_time' => '19:30:00',
            'location' => 'M. Chinnaswamy Stadium',
            'status' => 'booking_live',
        ],
        [
            'team1_id' => 6, // MI
            'team2_id' => 4, // KKR
            'match_date' => '2026-03-29',
            'match_time' => '19:30:00',
            'location' => 'Wankhede Stadium',
            'status' => 'booking_live',
        ],
        [
            'team1_id' => 8, // RR
            'team2_id' => 1, // CSK
            'match_date' => '2026-03-30',
            'match_time' => '19:30:00',
            'location' => 'Barsapara Cricket Stadium',
            'status' => 'booking_live',
        ],
        [
            'team1_id' => 7, // PBKS
            'team2_id' => 3, // GT
            'match_date' => '2026-03-31',
            'match_time' => '19:30:00',
            'location' => 'Punjab Cricket Association IS Bindra Stadium',
            'status' => 'booking_live',
        ],
        [
            'team1_id' => 5, // LSG
            'team2_id' => 2, // DC
            'match_date' => '2026-04-01',
            'match_time' => '19:30:00',
            'location' => 'BRSABV Ekana Cricket Stadium',
            'status' => 'booking_live',
        ],
        [
            'team1_id' => 4, // KKR
            'team2_id' => 10, // SRH
            'match_date' => '2026-04-02',
            'match_time' => '19:30:00',
            'location' => 'Eden Gardens',
            'status' => 'fast_filling',
        ],
        [
            'team1_id' => 1, // CSK
            'team2_id' => 7, // PBKS
            'match_date' => '2026-04-03',
            'match_time' => '19:30:00',
            'location' => 'M. A. Chidambaram Stadium',
            'status' => 'fast_filling',
        ],
        [
            'team1_id' => 2, // DC
            'team2_id' => 6, // MI
            'match_date' => '2026-04-04',
            'match_time' => '15:30:00',
            'location' => 'Arun Jaitley Stadium',
            'status' => 'booking_live',
        ],
        [
            'team1_id' => 3, // GT
            'team2_id' => 8, // RR
            'match_date' => '2026-04-04',
            'match_time' => '19:30:00',
            'location' => 'Narendra Modi Stadium',
            'status' => 'booking_live',
        ],
        [
            'team1_id' => 10, // SRH
            'team2_id' => 5, // LSG
            'match_date' => '2026-04-05',
            'match_time' => '15:30:00',
            'location' => 'Rajiv Gandhi International Cricket Stadium',
            'status' => 'fast_filling',
        ],
        [
            'team1_id' => 9, // RCB
            'team2_id' => 1, // CSK
            'match_date' => '2026-04-05',
            'match_time' => '19:30:00',
            'location' => 'M. Chinnaswamy Stadium',
            'status' => 'fast_filling',
        ],
        [
            'team1_id' => 4, // KKR
            'team2_id' => 7, // PBKS
            'match_date' => '2026-04-06',
            'match_time' => '19:30:00',
            'location' => 'Eden Gardens',
            'status' => 'booking_live',
        ],
        [
            'team1_id' => 8, // RR
            'team2_id' => 6, // MI
            'match_date' => '2026-04-07',
            'match_time' => '19:30:00',
            'location' => 'Barsapara Cricket Stadium',
            'status' => 'fast_filling',
        ],
        [
            'team1_id' => 2, // DC
            'team2_id' => 3, // GT
            'match_date' => '2026-04-08',
            'match_time' => '19:30:00',
            'location' => 'Arun Jaitley Stadium',
            'status' => 'booking_live',
        ],
        [
            'team1_id' => 4, // KKR
            'team2_id' => 5, // LSG
            'match_date' => '2026-04-09',
            'match_time' => '19:30:00',
            'location' => 'Eden Gardens',
            'status' => 'fast_filling',
        ],
    ]);
    }
}
