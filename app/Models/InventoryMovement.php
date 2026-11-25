<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryMovement extends Model
{
    protected $guarded = [];

    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function variation(): BelongsTo { return $this->belongsTo(ProductVariation::class, 'product_variation_id'); }
    public function creator(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
}
