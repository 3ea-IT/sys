<?php

namespace App\Services;

use Razorpay\Api\Api;
use Illuminate\Support\Facades\Log;

class RazorpayService
{
    private $api;

    public function __construct()
    {
        $this->api = new Api(
            config('services.razorpay.key'),
            config('services.razorpay.secret')
        );
    }

    /**
     * Create a Razorpay order
     */
    public function createOrder($amount, $description, $customerId, $referenceType, $referenceId)
    {
        try {
            // Amount in paise (multiply by 100)
            $amountInPaise = (int)($amount * 100);

            $order = $this->api->order->create([
                'amount' => $amountInPaise,
                'currency' => 'INR',
                'receipt' => "receipt_{$referenceType}_{$referenceId}_" . time(),
                'description' => $description,
                'notes' => [
                    'reference_type' => $referenceType,
                    'reference_id' => $referenceId,
                    'user_id' => $customerId,
                ]
            ]);

            Log::info('Razorpay order created', [
                'order_id' => $order['id'],
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'amount' => $amount,
            ]);

            return [
                'success' => true,
                'order_id' => $order['id'],
                'amount' => $amount,
                'currency' => 'INR',
                'key' => config('services.razorpay.key'),
            ];
        } catch (\Exception $e) {
            Log::error('Razorpay order creation failed', [
                'error' => $e->getMessage(),
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
            ]);

            return [
                'success' => false,
                'message' => 'Failed to create payment order. Please try again.',
            ];
        }
    }

    /**
     * Verify payment signature
     */
    public function verifyPayment($orderId, $paymentId, $signature)
    {
        try {
            $expectedSignature = hash_hmac(
                'sha256',
                "{$orderId}|{$paymentId}",
                config('services.razorpay.secret')
            );

            if ($expectedSignature !== $signature) {
                Log::warning('Razorpay signature verification failed', [
                    'order_id' => $orderId,
                    'payment_id' => $paymentId,
                ]);
                return false;
            }

            Log::info('Razorpay payment verified', [
                'order_id' => $orderId,
                'payment_id' => $paymentId,
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Razorpay verification failed', [
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Fetch payment details
     */
    public function getPaymentDetails($paymentId)
    {
        try {
            $payment = $this->api->payment->fetch($paymentId);
            return $payment;
        } catch (\Exception $e) {
            Log::error('Failed to fetch payment details', [
                'payment_id' => $paymentId,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Refund payment
     */
    public function refundPayment($paymentId, $amount = null)
    {
        try {
            $refundData = [];
            if ($amount) {
                $refundData['amount'] = (int)($amount * 100); // Convert to paise
            }

            $refund = $this->api->refund->create([
                'payment_id' => $paymentId,
            ] + $refundData);

            Log::info('Razorpay refund created', [
                'payment_id' => $paymentId,
                'refund_id' => $refund['id'],
                'amount' => $amount,
            ]);

            return [
                'success' => true,
                'refund_id' => $refund['id'],
            ];
        } catch (\Exception $e) {
            Log::error('Razorpay refund failed', [
                'payment_id' => $paymentId,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Refund failed. Please contact support.',
            ];
        }
    }
}
