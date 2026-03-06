<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('experience_id')->constrained()->onDelete('cascade');
            
            $table->enum('booking_type', ['instant', 'hold_confirmed'])->default('instant');
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending');
            
            $table->decimal('total_amount', 10, 2);
            $table->decimal('paid_amount', 10, 2);
            $table->decimal('hold_token_paid', 10, 2)->default(0); // for hold→confirm
            
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            
            $table->timestamps();
            
            $table->index(['user_id', 'status']);
            $table->index(['experience_id', 'status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('bookings');
    }
};
