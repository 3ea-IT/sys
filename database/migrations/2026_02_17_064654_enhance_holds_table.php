<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('holds', function (Blueprint $table) {
            // Link to bookings (when hold → confirmed)
            $table->foreignId('booking_id')->nullable()->constrained()->after('id');
            
            // Enhanced status
            $table->enum('status', ['active', 'confirmed', 'released', 'expired'])->default('active')->change();
            
            // Track if converted to booking
            $table->boolean('converted_to_booking')->default(false)->after('status');
        });
    }

    public function down()
    {
        Schema::table('holds', function (Blueprint $table) {
            $table->dropForeign(['booking_id']);
            $table->dropColumn(['booking_id', 'converted_to_booking']);
        });
    }
};
