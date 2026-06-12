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
        Schema::create('temples', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location');
            $table->string('image')->nullable();
            $table->decimal('rating', 3, 1)->default(4.5);
            $table->enum('crowd_level', ['Low', 'Moderate', 'High', 'Very High', 'Extreme'])->default('Moderate');
            $table->boolean('has_vip_darshan')->default(false);
            $table->decimal('instant_price', 10, 2)->nullable();
            $table->decimal('hold_token', 10, 2)->nullable();
            $table->longText('description')->nullable();
            $table->json('amenities')->nullable();
            $table->json('timings')->nullable();
            $table->json('facilities')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->index('status');
            $table->index('crowd_level');
            $table->index('has_vip_darshan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('temples');
    }
};
