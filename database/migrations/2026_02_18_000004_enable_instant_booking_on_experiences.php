<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update all existing experiences to enable instant booking
        DB::table('experiences')->update([
            'booking_mode' => 'both',  // Support both instant and hold
            'instant_availability' => DB::raw('CASE WHEN instant_availability IS NULL OR instant_availability = 0 THEN capacity ELSE instant_availability END'),
            'instant_price' => DB::raw('CASE WHEN instant_price IS NULL OR instant_price = 0 THEN price ELSE instant_price END'),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to instant mode
        DB::table('experiences')->update([
            'booking_mode' => 'instant',
            'instant_availability' => 0,
            'instant_price' => 0,
        ]);
    }
};
