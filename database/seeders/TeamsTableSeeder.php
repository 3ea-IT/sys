<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeamsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('teams')->insert([
            ['name' => 'Chennai Super Kings', 'logo' => 'path_to_csk_logo'],
            ['name' => 'Delhi Capitals', 'logo' => 'path_to_dc_logo'],
            ['name' => 'Gujarat Titans', 'logo' => 'path_to_gt_logo'],
            ['name' => 'Kolkata Knight Riders', 'logo' => 'path_to_kkr_logo'],
            ['name' => 'Lucknow Super Giants', 'logo' => 'path_to_lsg_logo'],
            ['name' => 'Mumbai Indians', 'logo' => 'path_to_mi_logo'],
            ['name' => 'Punjab Kings', 'logo' => 'path_to_pbks_logo'],
            ['name' => 'Rajasthan Royals', 'logo' => 'path_to_rr_logo'],
            ['name' => 'Royal Challengers Bengaluru', 'logo' => 'path_to_rcb_logo'],
            ['name' => 'Sunrisers Hyderabad', 'logo' => 'path_to_srh_logo'],
        ]);
    }
}
