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
            // Just add the new column - don't worry about the old one
            $table->foreignId('movie_show_slot_id')->nullable()->constrained()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movie_ticket_bookings', function (Blueprint $table) {
            $table->dropForeign(['movie_show_slot_id']);
            $table->dropColumn('movie_show_slot_id');
        });
    }
};
