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
        Schema::table('holds', function (Blueprint $table) {
            // Add party_size column (number of people in this hold)
            // Default to 1 for backward compatibility
            // Max 2 for holds (enforced in controller validation)
            $table->unsignedInteger('party_size')->default(1)->after('source');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('holds', function (Blueprint $table) {
            $table->dropColumn('party_size');
        });
    }
};
