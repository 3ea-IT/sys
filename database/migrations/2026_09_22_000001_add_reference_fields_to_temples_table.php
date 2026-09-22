<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add the columns from the "Indian Temples List" reference sheet.
     */
    public function up(): void
    {
        Schema::table('temples', function (Blueprint $table) {
            $table->unsignedInteger('list_no')->nullable()->after('id');
            $table->string('city')->nullable()->after('location');
            $table->string('state')->nullable()->after('city');
            $table->string('main_deity')->nullable()->after('state');
            $table->string('established')->nullable()->after('description');
            $table->string('significance')->nullable()->after('established');
            $table->boolean('online_booking')->default(false)->after('has_vip_darshan');
            $table->string('booking_url', 500)->nullable()->after('online_booking');

            $table->index('state');
            $table->index('online_booking');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('temples', function (Blueprint $table) {
            $table->dropIndex(['state']);
            $table->dropIndex(['online_booking']);
            $table->dropColumn([
                'list_no',
                'city',
                'state',
                'main_deity',
                'established',
                'significance',
                'online_booking',
                'booking_url',
            ]);
        });
    }
};
