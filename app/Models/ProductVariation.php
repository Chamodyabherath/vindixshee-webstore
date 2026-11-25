<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductVariation extends Model
{
    use SoftDeletes;

    protected $guarded = [];
    protected $casts = ['price' => 'decimal:2', 'compare_price' => 'decimal:2'];

    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
}
