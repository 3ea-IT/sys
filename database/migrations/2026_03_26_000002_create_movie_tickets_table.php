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
        Schema::create('movie_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cinema_id')->constrained()->cascadeOnDelete();
            $table->string('movie_title');
            $table->string('language')->default('English');
            $table->string('format')->default('2D'); // '2D', '3D', 'IMAX', etc.
            $table->date('show_date');
            $table->time('show_time');
            $table->time('show_end_time')->nullable();
            $table->integer('total_seats');
            $table->integer('available_seats');
            $table->decimal('price', 10, 2);
            $table->string('screen_name')->nullable(); // Screen 1, Screen 2, etc
            $table->text('movie_description')->nullable();
            $table->string('movie_image')->nullable();
            $table->enum('status', ['active', 'inactive', 'sold_out'])->default('active');
            $table->timestamps();
            
            // Index for faster queries
            $table->index(['cinema_id', 'show_date']);
            $table->index(['status', 'show_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movie_tickets');
    }
};
