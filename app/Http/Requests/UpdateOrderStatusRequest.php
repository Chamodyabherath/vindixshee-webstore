<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array { return ['order_status' => ['required', 'in:pending,confirmed,packing,in_courier,delivered,cancelled,returned'], 'note' => ['nullable', 'string', 'max:1000']]; }
}
