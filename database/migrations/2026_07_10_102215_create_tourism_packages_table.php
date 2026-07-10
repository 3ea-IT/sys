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
        Schema::create('tourism_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location');
            $table->string('image')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('duration')->nullable();
            $table->decimal('rating', 3, 1)->default(4.5);
            $table->longText('description')->nullable();
            $table->json('itinerary')->nullable();
            $table->integer('capacity')->default(20);
            $table->integer('available_slots')->default(20);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tourism_packages');
    }
};
