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
        Schema::create('festival_shows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('temple_id')->constrained('temples')->cascadeOnDelete();
            $table->string('name');
            $table->longText('description')->nullable();
            $table->date('date')->nullable();
            $table->string('time')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('capacity')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('festival_shows');
    }
};
