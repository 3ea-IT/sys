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
        Schema::table('experiences', function (Blueprint $table) {
            $table->unsignedBigInteger('vendor_id')->nullable()->after('id');
            $table->foreign('vendor_id')->references('id')->on('users')->onDelete('cascade');
            $table->enum('approval_status', ['pending', 'approved', 'rejected'])->default('pending')->after('status');
            $table->text('rejection_reason')->nullable()->after('approval_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('experiences', function (Blueprint $table) {
            $table->dropForeign(['vendor_id']);
            $table->dropColumn(['vendor_id', 'approval_status', 'rejection_reason']);
        });
    }
};
