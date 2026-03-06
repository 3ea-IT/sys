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
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'business_name',
                'business_type',
                'business_description',
                'phone',
                'address',
                'city',
                'state',
                'postal_code',
                'country',
                'business_license_number',
                'tax_id',
                'bank_details',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('business_name')->nullable()->after('name');
            $table->string('business_type')->nullable()->after('business_name');
            $table->text('business_description')->nullable()->after('business_type');
            $table->string('phone')->nullable()->after('business_description');
            $table->string('address')->nullable()->after('phone');
            $table->string('city')->nullable()->after('address');
            $table->string('state')->nullable()->after('city');
            $table->string('postal_code')->nullable()->after('state');
            $table->string('country')->nullable()->after('postal_code');
            $table->string('business_license_number')->nullable()->after('country');
            $table->string('tax_id')->nullable()->after('business_license_number');
            $table->longtext('bank_details')->nullable()->after('tax_id');
        });
    }
};
