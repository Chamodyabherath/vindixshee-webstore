<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCouponRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array { return ['code' => ['required', 'string', 'max:50', 'unique:coupons,code'], 'name' => ['required', 'string', 'max:255'], 'type' => ['required', 'in:fixed,percentage'], 'value' => ['required', 'numeric', 'min:0'], 'minimum_order_amount' => ['nullable', 'numeric', 'min:0'], 'maximum_discount_amount' => ['nullable', 'numeric', 'min:0'], 'usage_limit' => ['nullable', 'integer', 'min:1'], 'status' => ['required', 'in:active,inactive']]; }
}
