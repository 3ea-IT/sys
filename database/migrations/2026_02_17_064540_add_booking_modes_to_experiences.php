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
        Schema::table('experiences', function (Blueprint $table) {
            // New booking modes
            $table->enum('booking_mode', ['instant', 'both'])->default('instant')->after('status');
            
            // Instant booking specific fields
            $table->decimal('instant_price', 10, 2)->nullable()->after('price');
            $table->integer('instant_availability')->default(0)->after('capacity');
            
            // Hold mode enhancements (if not exists)
            $table->integer('hold_duration')->default(30)->change(); // minutes
        });
    }

    public function down()
    {
        Schema::table('experiences', function (Blueprint $table) {
            $table->dropColumn(['booking_mode', 'instant_price', 'instant_availability']);
        });
    }
};
