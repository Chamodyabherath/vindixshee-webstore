<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductAttributeValue extends Model
{
    protected $guarded = [];
    public function attribute(): BelongsTo { return $this->belongsTo(ProductAttribute::class, 'product_attribute_id'); }
}
