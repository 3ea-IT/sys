<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('swiggy_dineout_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('restaurant_id');
            $table->string('restaurant_name')->nullable();
            $table->date('reservation_date');
            $table->string('reservation_time');
            $table->unsignedInteger('guest_count')->default(2);
            $table->unsignedInteger('slot_id');
            $table->string('item_id');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('status')->default('confirmed');
            $table->string('booking_reference')->unique();
            $table->json('swiggy_response')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'reservation_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('swiggy_dineout_bookings');
    }
};
