<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['nullable', 'email'],
            'customer_phone' => ['required', 'string', 'max:40'],
            'billing_address' => ['required', 'array'],
            'shipping_address' => ['required', 'array'],
            'payment_method' => ['required', 'in:cod,card,bank_transfer'],
            'shipping_method_id' => ['nullable', 'exists:shipping_methods,id'],
            'coupon_code' => ['nullable', 'string'],
            'customer_note' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
