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
        Schema::create('flights', function (Blueprint $table) {
            $table->id();
            $table->string('airline');
            $table->string('flight_number');
            $table->string('origin');
            $table->string('destination');
            $table->dateTime('departure_time');
            $table->dateTime('arrival_time');
            $table->integer('duration_minutes');
            $table->enum('seat_class', ['economy', 'business', 'first'])->default('economy');
            $table->string('image')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('capacity')->default(60);
            $table->integer('seats_available')->default(60);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->index('status');
            $table->index(['origin', 'destination']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flights');
    }
};
