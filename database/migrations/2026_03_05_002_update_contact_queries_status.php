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
        // Temporarily disable strict mode
        DB::statement('SET SESSION sql_mode="NO_ZERO_DATE,NO_ZERO_IN_DATE"');

        // Update the contact_queries status values
        // First, update old values to new ones
        DB::unprepared("UPDATE contact_queries SET status = 'pending' WHERE status IN ('open', 'in-progress')");
        DB::unprepared("UPDATE contact_queries SET status = 'rejected' WHERE status = 'closed'");
        
        // Modify the column type
        DB::unprepared("ALTER TABLE contact_queries MODIFY COLUMN status VARCHAR(20) DEFAULT 'pending'");
        
        // Re-enable strict mode
        DB::statement('SET SESSION sql_mode="STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION"');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We're not reverting this - the data transformation is permanent
        // But we can change the column back to support old values if needed
    }
};
