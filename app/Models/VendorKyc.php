<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorKyc extends Model
{
    use HasFactory;

    protected $table = 'vendor_kyc';

    protected $fillable = [
        'user_id',
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
        'account_number',
        'ifsc_code',
        'bank_document_path',
        'status',
        'rejection_reason',
        'submitted_at',
        'approved_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'approved_at' => 'datetime',
    ];

    /**
     * Get the user associated with this KYC.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
