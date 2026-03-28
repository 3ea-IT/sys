<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('movie_ticket_bookings', function (Blueprint $table) {
            // Store selected seat numbers as JSON (e.g., ["A1", "A2", "B5"])
            $table->json('seat_numbers')->nullable()->after('quantity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movie_ticket_bookings', function (Blueprint $table) {
            $table->dropColumn('seat_numbers');
        });
    }
};
