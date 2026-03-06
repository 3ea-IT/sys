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
        // Convert any 'hold_only' booking modes to 'both'
        DB::table('experiences')
            ->where('booking_mode', 'hold_only')
            ->update(['booking_mode' => 'both']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse - this just updates data
    }
};
