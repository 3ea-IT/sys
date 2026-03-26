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
        Schema::create('movie_ticket_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('movie_ticket_id')->constrained()->cascadeOnDelete();
            $table->integer('quantity');
            $table->decimal('total_amount', 10, 2);
            $table->decimal('amount_per_ticket', 10, 2);
            $table->enum('status', ['confirmed', 'cancelled', 'completed'])->default('confirmed');
            $table->string('booking_reference')->unique();
            $table->timestamp('valid_until')->nullable();
            $table->timestamps();
            
            // Index for faster queries
            $table->index(['user_id', 'status']);
            $table->index(['movie_ticket_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movie_ticket_bookings');
    }
};
