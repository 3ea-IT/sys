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
        Schema::create('flight_travelers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('flight_booking_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['adult', 'child', 'infant'])->default('adult');
            $table->string('title')->nullable();
            $table->string('first_name');
            $table->string('last_name');
            $table->date('dob')->nullable();
            $table->string('passport_number')->nullable();
            $table->date('passport_expiry')->nullable();
            $table->string('passport_country')->nullable();
            $table->string('special_assistance')->nullable();
            $table->string('meal_preference')->nullable();
            $table->foreignId('seat_id')->nullable()->constrained('flight_seats')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flight_travelers');
    }
};
