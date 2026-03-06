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
        // Update any 'incomplete' status to 'submitted'
        DB::table('vendor_kyc')
            ->where('status', 'incomplete')
            ->update(['status' => 'submitted']);

        // Modify the enum to remove 'incomplete'
        Schema::table('vendor_kyc', function (Blueprint $table) {
            $table->enum('status', ['submitted', 'approved', 'rejected'])->default('submitted')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original enum with 'incomplete'
        DB::table('vendor_kyc')
            ->where('status', 'submitted')
            ->where('submitted_at', null)
            ->update(['status' => 'incomplete']);

        Schema::table('vendor_kyc', function (Blueprint $table) {
            $table->enum('status', ['incomplete', 'submitted', 'approved', 'rejected'])->default('incomplete')->change();
        });
    }
};
