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
        Schema::create('tourism_package_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tourism_package_id')->constrained()->cascadeOnDelete();
            $table->integer('party_size');
            $table->decimal('amount_per_person', 10, 2);
            $table->decimal('total_amount', 10, 2);
            $table->date('travel_date')->nullable();
            $table->enum('status', ['confirmed', 'cancelled'])->default('confirmed');
            $table->string('booking_reference')->unique();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['tourism_package_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tourism_package_bookings');
    }
};
