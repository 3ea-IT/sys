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
        Schema::create('swiggy_dineout_tokens', function (Blueprint $table) {
            $table->id();
            // Nullable so this can also hold a single "system/admin" token
            // when no specific user initiated the OAuth flow.
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('client_id')->nullable();
            $table->text('access_token');
            $table->string('token_type')->default('Bearer');
            $table->string('scope')->nullable();
            $table->unsignedInteger('expires_in')->nullable();
            $table->timestamp('obtained_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('swiggy_dineout_tokens');
    }
};
