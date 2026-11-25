<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StockAdjustmentRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array { return ['product_id' => ['required', 'exists:products,id'], 'product_variation_id' => ['nullable', 'exists:product_variations,id'], 'quantity' => ['required', 'integer', 'not_in:0'], 'note' => ['required', 'string', 'max:1000']]; }
}
