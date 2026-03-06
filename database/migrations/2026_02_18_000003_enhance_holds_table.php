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
        Schema::table('holds', function (Blueprint $table) {
            // Track hold source and state transitions
            $table->enum('source', ['direct', 'waitlist'])->default('direct')->after('status');
            $table->timestamp('confirmed_at')->nullable()->after('expires_at');
            $table->timestamp('released_at')->nullable()->after('confirmed_at');
            $table->timestamp('expired_at')->nullable()->after('released_at');
            $table->string('release_reason')->nullable()->after('expired_at');
            $table->string('expire_reason')->nullable()->after('release_reason');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('holds', function (Blueprint $table) {
            $table->dropColumn([
                'source',
                'confirmed_at',
                'released_at',
                'expired_at',
                'release_reason',
                'expire_reason',
            ]);
        });
    }
};
