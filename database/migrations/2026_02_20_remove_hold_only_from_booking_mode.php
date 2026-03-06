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
        // Convert any 'hold_only' booking modes to 'both' first
        DB::table('experiences')
            ->where('booking_mode', 'hold_only')
            ->update(['booking_mode' => 'both']);

        // Modify the enum column to remove 'hold_only' option
        Schema::table('experiences', function (Blueprint $table) {
            // MySQL: Drop and recreate enum with only 'instant' and 'both'
            DB::statement("ALTER TABLE experiences MODIFY booking_mode ENUM('instant', 'both') DEFAULT 'instant'");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restore the original enum with 'hold_only' option
        Schema::table('experiences', function (Blueprint $table) {
            DB::statement("ALTER TABLE experiences MODIFY booking_mode ENUM('hold_only', 'instant', 'both') DEFAULT 'hold_only'");
        });
    }
};
