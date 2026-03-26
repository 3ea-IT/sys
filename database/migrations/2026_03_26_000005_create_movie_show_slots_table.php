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
        Schema::create('movie_show_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cinema_id')->constrained()->cascadeOnDelete();
            $table->foreignId('movie_id')->constrained()->cascadeOnDelete();
            $table->string('screen_name')->nullable(); // Screen 1, Screen 2, etc
            $table->date('show_date');
            $table->time('show_time');
            $table->time('show_end_time')->nullable();
            $table->integer('total_seats');
            $table->integer('available_seats');
            $table->decimal('price', 10, 2);
            $table->enum('status', ['active', 'inactive', 'sold_out'])->default('active');
            $table->timestamps();
            
            // Index for faster queries
            $table->index(['cinema_id', 'show_date']);
            $table->index(['movie_id', 'show_date']);
            $table->index(['status', 'show_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movie_show_slots');
    }
};
