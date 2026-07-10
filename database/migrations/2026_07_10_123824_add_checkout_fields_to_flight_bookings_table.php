<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('flight_bookings', function (Blueprint $table) {
            $table->string('fare_tier')->default('standard')->after('flight_id');
            $table->string('fare_label')->nullable()->after('fare_tier');
            $table->integer('baggage_checked_kg')->nullable()->after('fare_label');
            $table->integer('baggage_cabin_kg')->nullable()->after('baggage_checked_kg');
            $table->boolean('seat_selection_included')->default(true)->after('baggage_cabin_kg');
            $table->boolean('refundable')->default(false)->after('seat_selection_included');
            $table->decimal('change_fee', 8, 2)->default(0)->after('refundable');
            $table->decimal('fare_total', 10, 2)->default(0)->after('total_amount');
            $table->decimal('seats_total', 8, 2)->default(0)->after('fare_total');
            $table->decimal('addons_total', 8, 2)->default(0)->after('seats_total');
            $table->string('contact_email')->nullable()->after('addons_total');
            $table->string('contact_phone')->nullable()->after('contact_email');
        });

        DB::statement("ALTER TABLE flight_bookings MODIFY status ENUM('draft', 'confirmed', 'cancelled') NOT NULL DEFAULT 'draft'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE flight_bookings MODIFY status ENUM('confirmed', 'cancelled') NOT NULL DEFAULT 'confirmed'");

        Schema::table('flight_bookings', function (Blueprint $table) {
            $table->dropColumn([
                'fare_tier', 'fare_label', 'baggage_checked_kg', 'baggage_cabin_kg',
                'seat_selection_included', 'refundable', 'change_fee',
                'fare_total', 'seats_total', 'addons_total', 'contact_email', 'contact_phone',
            ]);
        });
    }
};
