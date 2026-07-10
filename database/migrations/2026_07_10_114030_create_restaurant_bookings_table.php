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
        Schema::create('restaurant_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('restaurant_id')->constrained()->cascadeOnDelete();
            $table->integer('party_size');
            $table->date('reservation_date');
            $table->string('reservation_time');
            $table->enum('status', ['confirmed', 'cancelled'])->default('confirmed');
            $table->string('booking_reference')->unique();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['restaurant_id', 'reservation_date', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurant_bookings');
    }
};
