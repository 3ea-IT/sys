<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
    {
        Schema::create('ipl_matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team1_id')->constrained('teams');
            $table->foreignId('team2_id')->constrained('teams');
            $table->date('match_date');
            $table->time('match_time');
            $table->string('location');
            $table->enum('status', ['sold_out', 'booking_live', 'fast_filling']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ipl_matches');
    }
};
