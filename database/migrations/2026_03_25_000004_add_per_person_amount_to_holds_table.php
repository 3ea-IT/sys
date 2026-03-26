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
            // Add per_person_amount to explicitly store the hold token per person
            $table->decimal('per_person_amount', 10, 2)->nullable()->after('party_size');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('holds', function (Blueprint $table) {
            $table->dropColumn('per_person_amount');
        });
    }
};
