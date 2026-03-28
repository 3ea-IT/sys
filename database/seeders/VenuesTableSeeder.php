<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VenuesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   public function run()
    {
        DB::table('venues')->insert([
            ['name' => 'Wankhede Stadium', 'location' => 'Mumbai'],
            ['name' => 'M. A. Chidambaram Stadium', 'location' => 'Chennai'],
            ['name' => 'M. Chinnaswamy Stadium', 'location' => 'Bengaluru'],
            ['name' => 'Eden Gardens', 'location' => 'Kolkata'],
            ['name' => 'Rajiv Gandhi International Cricket Stadium', 'location' => 'Hyderabad'],
            ['name' => 'Arun Jaitley Stadium', 'location' => 'Delhi'],
            ['name' => 'BRSABV Ekana Cricket Stadium', 'location' => 'Lucknow'],
            ['name' => 'Punjab Cricket Association IS Bindra Stadium', 'location' => 'Mohali'],
            ['name' => 'Himachal Pradesh Cricket Association Stadium', 'location' => 'Dharamshala'],
            ['name' => 'Sawai Mansingh Stadium', 'location' => 'Jaipur'],
            ['name' => 'Narendra Modi Stadium', 'location' => 'Ahmedabad'],
            ['name' => 'DY Patil Stadium', 'location' => 'Navi Mumbai'],
            ['name' => 'Brabourne Stadium', 'location' => 'Mumbai'],
            ['name' => 'Barsapara Cricket Stadium', 'location' => 'Guwahati'],
        ]);
    }
}
