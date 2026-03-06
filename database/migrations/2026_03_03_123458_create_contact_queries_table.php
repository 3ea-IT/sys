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
        Schema::create('contact_queries', function (Blueprint $table) {
            $table->id();
            $table->string('category'); // booking, payment, account, hold, refund, technical, other
            $table->string('subject');
            $table->string('email');
            $table->string('phone');
            $table->text('description');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('status', ['open', 'in-progress', 'resolved', 'closed'])->default('open');
            $table->text('admin_notes')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('email');
            $table->index('priority');
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_queries');
    }
};
