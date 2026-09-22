<?php

namespace Database\Seeders;

use App\Models\Temple;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IndianTemplesSeeder extends Seeder
{
    /**
     * Seed temples from the "Indian Temples List" reference sheet
     * (public/assets/Indian Temples List.xlsx, exported to data/temples.json).
     */
    public function run(): void
    {
        $temples = json_decode(file_get_contents(__DIR__ . '/data/temples.json'), true);

        DB::transaction(function () use ($temples) {
            foreach ($temples as $temple) {
                // Temple names repeat across cities (e.g. Birla Mandir), so match on both
                Temple::updateOrCreate(
                    ['name' => $temple['name'], 'city' => $temple['city']],
                    $temple + ['status' => 'active']
                );
            }
        });

        $this->command?->info(count($temples) . ' temples seeded from the Indian Temples List.');
    }
}
