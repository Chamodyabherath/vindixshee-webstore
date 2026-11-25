<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Coupon extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    protected $casts = ['value' => 'decimal:2', 'minimum_order_amount' => 'decimal:2', 'maximum_discount_amount' => 'decimal:2', 'starts_at' => 'datetime', 'expires_at' => 'datetime'];
}
