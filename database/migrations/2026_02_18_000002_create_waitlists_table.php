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
        Schema::create('waitlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('experience_id')->constrained()->onDelete('cascade');
            $table->foreignId('hold_id')->nullable()->constrained()->onDelete('set null');
            $table->integer('position')->default(0); // Queue position: 1 = next in line
            $table->enum('status', ['waiting', 'offered', 'accepted', 'rejected', 'expired'])->default('waiting');
            $table->timestamp('offered_at')->nullable();
            $table->timestamp('offer_expires_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['experience_id', 'status']);
            $table->index(['user_id', 'status']);
            $table->unique(['user_id', 'experience_id']); // Prevent duplicate waitlist entries
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('waitlists');
    }
};
