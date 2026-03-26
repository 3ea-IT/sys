<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Convert any 'validated' bookings to 'confirmed'
            DB::table('bookings')->where('status', 'validated')->update(['status' => 'confirmed']);
            
            // Revert status enum back to three states only
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->change();
            
            // Drop validated_at column
            $table->dropColumn('validated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->timestamp('validated_at')->nullable()->after('cancelled_at');
            $table->enum('status', ['pending', 'confirmed', 'validated', 'cancelled'])->change();
        });
    }
};
