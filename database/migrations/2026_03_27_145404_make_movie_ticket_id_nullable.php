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
            // Make movie_ticket_id nullable since we're now using movie_show_slot_id
            $table->foreignId('movie_ticket_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movie_ticket_bookings', function (Blueprint $table) {
            $table->foreignId('movie_ticket_id')->nullable(false)->change();
        });
    }
};
