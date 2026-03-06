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
        Schema::create('vendor_kyc', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Business Information
            $table->string('business_name');
            $table->string('business_type');
            $table->text('business_description')->nullable();
            
            // Contact Information
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country')->nullable();
            
            // Legal Information
            $table->string('business_license_number')->nullable();
            $table->string('tax_id')->nullable();
            
            // Bank Details
            $table->string('account_number')->nullable();
            $table->string('ifsc_code')->nullable();
            $table->string('bank_document_path')->nullable(); // Path to Bank Passbook or Cancelled Cheque
            
            // Status
            $table->enum('status', ['submitted', 'approved', 'rejected'])->default('submitted');
            $table->text('rejection_reason')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_kyc');
    }
};
