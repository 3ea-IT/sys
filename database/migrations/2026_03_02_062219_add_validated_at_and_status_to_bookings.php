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
        Schema::table('bookings', function (Blueprint $table) {
            // Add validated_at column after cancelled_at
            $table->timestamp('validated_at')->nullable()->after('cancelled_at');
            
            // Change status enum to include 'validated'
            $table->enum('status', ['pending', 'confirmed', 'validated', 'cancelled'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Revert status enum
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->change();
            
            // Drop validated_at column
            $table->dropColumn('validated_at');
        });
    }
};
