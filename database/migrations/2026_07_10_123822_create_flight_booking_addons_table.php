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
        Schema::create('flight_booking_addons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('flight_booking_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['extra_bag', 'priority_boarding', 'travel_insurance']);
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 8, 2);
            $table->decimal('total_price', 8, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flight_booking_addons');
    }
};
