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
        Schema::create('flight_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('flight_id')->constrained()->cascadeOnDelete();
            $table->integer('passenger_count');
            $table->decimal('amount_per_seat', 10, 2);
            $table->decimal('total_amount', 10, 2);
            $table->enum('status', ['confirmed', 'cancelled'])->default('confirmed');
            $table->string('booking_reference')->unique();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['flight_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flight_bookings');
    }
};
