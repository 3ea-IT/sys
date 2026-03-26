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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('order_id')->unique(); // Razorpay order ID
            $table->string('payment_id')->nullable(); // Razorpay payment ID
            $table->string('signature')->nullable(); // Payment signature
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('INR');
            $table->string('reference_type'); // 'booking_instant', 'hold_token', 'hold_confirmation'
            $table->unsignedBigInteger('reference_id'); // experience_id, hold_id, or booking_id
            $table->enum('status', ['pending', 'success', 'failed', 'refunded'])->default('pending');
            $table->timestamps();

            $table->index('order_id');
            $table->index('payment_id');
            $table->index('user_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
