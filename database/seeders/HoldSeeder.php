<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Hold;
use App\Models\User;
use App\Models\Experience;
use Carbon\Carbon;

class HoldSeeder extends Seeder
{
    public function run()
    {
        $user = User::first();
        $experience = Experience::first();

        Hold::create([
            'user_id' => $user->id,
            'experience_id' => $experience->id,
            'expires_at' => Carbon::now()->addMinutes(25),
            'status' => 'active',
        ]);
    }
}
