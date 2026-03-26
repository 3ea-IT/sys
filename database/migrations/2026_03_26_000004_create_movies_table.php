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
        Schema::create('movies', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('language')->default('English');
            $table->string('format')->default('2D'); // '2D', '3D', 'IMAX', etc.
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->integer('duration')->nullable(); // in minutes
            $table->string('genre')->nullable();
            $table->string('rating')->nullable(); // U, UA, A, S
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movies');
    }
};
