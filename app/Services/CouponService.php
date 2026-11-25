<?php

namespace App\Services;

use App\Models\Coupon;
use Illuminate\Validation\ValidationException;

class CouponService
{
    public function validate(?string $code, float|string $subtotal): ?Coupon
    {
        if (! $code) {
            return null;
        }

        $coupon = Coupon::where('code', strtoupper($code))->where('status', 'active')->first();

        if (! $coupon) {
            throw ValidationException::withMessages(['coupon_code' => 'Coupon is invalid.']);
        }

        if (($coupon->starts_at && now()->lt($coupon->starts_at)) || ($coupon->expires_at && now()->gt($coupon->expires_at))) {
            throw ValidationException::withMessages(['coupon_code' => 'Coupon is expired.']);
        }

        if ($coupon->usage_limit && $coupon->used_count >= $coupon->usage_limit) {
            throw ValidationException::withMessages(['coupon_code' => 'Coupon usage limit reached.']);
        }

        if ($coupon->minimum_order_amount && (float) $subtotal < (float) $coupon->minimum_order_amount) {
            throw ValidationException::withMessages(['coupon_code' => 'Minimum order amount not reached.']);
        }

        return $coupon;
    }

    public function discount(?Coupon $coupon, float|string $subtotal): string
    {
        if (! $coupon) {
            return '0.00';
        }

        $amount = $coupon->type === 'percentage'
            ? (float) $subtotal * ((float) $coupon->value / 100)
            : (float) $coupon->value;

        if ($coupon->maximum_discount_amount) {
            $amount = min($amount, (float) $coupon->maximum_discount_amount);
        }

        return number_format(min($amount, (float) $subtotal), 2, '.', '');
    }
}
