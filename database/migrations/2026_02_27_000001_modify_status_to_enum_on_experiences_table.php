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
        // Modify the status column to be an enum if it exists and is not already an enum
        if (Schema::hasColumn('experiences', 'status')) {
            // For MySQL, we need to use raw SQL to convert string to enum
            DB::statement("ALTER TABLE experiences MODIFY status ENUM('active', 'inactive') NOT NULL DEFAULT 'active'");
        } else {
            // If column doesn't exist, add it
            Schema::table('experiences', function (Blueprint $table) {
                $table->enum('status', ['active', 'inactive'])->default('active')->after('id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to string column
        DB::statement("ALTER TABLE experiences MODIFY status VARCHAR(255)");
    }
};
