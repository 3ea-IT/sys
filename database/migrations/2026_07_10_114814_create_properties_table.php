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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['Hotel', 'Resort', 'Homestay', 'Guest House', 'Vacation Rental'])->default('Hotel');
            $table->string('location');
            $table->string('image')->nullable();
            $table->decimal('price_per_night', 10, 2);
            $table->decimal('rating', 3, 1)->default(4.0);
            $table->json('amenities')->nullable();
            $table->longText('description')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->index('status');
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
