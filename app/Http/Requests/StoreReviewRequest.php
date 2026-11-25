<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array { return ['product_id' => ['required', 'exists:products,id'], 'order_id' => ['nullable', 'exists:orders,id'], 'customer_name' => ['required', 'string', 'max:255'], 'customer_email' => ['nullable', 'email'], 'rating' => ['required', 'integer', 'min:1', 'max:5'], 'title' => ['nullable', 'string', 'max:255'], 'comment' => ['required', 'string', 'max:2000']]; }
}
