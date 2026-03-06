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
                'vendor_status',
                'vendor_approved_at',
                'vendor_rejection_reason',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('vendor_status', ['pending', 'approved', 'rejected', 'suspended'])->default('pending')->after('bank_details');
            $table->timestamp('vendor_approved_at')->nullable()->after('vendor_status');
            $table->text('vendor_rejection_reason')->nullable()->after('vendor_approved_at');
        });
    }
};
