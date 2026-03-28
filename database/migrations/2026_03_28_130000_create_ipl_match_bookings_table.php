<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ipl_match_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('ipl_match_id')->constrained('ipl_matches')->cascadeOnDelete();
            $table->integer('quantity');
            $table->json('seat_numbers')->nullable();
            $table->decimal('total_amount', 10, 2);
            $table->decimal('amount_per_ticket', 10, 2);
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->string('booking_reference')->unique();
            $table->string('razorpay_order_id')->nullable();
            $table->string('razorpay_payment_id')->nullable();
            $table->string('razorpay_signature')->nullable();
            $table->enum('payment_status', ['pending', 'success', 'failed'])->default('pending');
            $table->json('payment_details')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ipl_match_bookings');
    }
};
