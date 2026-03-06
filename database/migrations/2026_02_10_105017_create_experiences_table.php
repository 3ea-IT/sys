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
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->string('title');
            $table->string('category');
            $table->string('location')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('hold_token', 10, 2);
            $table->integer('hold_duration'); // minutes
            $table->integer('capacity');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('experiences');
    }
};
