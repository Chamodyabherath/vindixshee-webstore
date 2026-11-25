<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'price' => 'decimal:2',
        'compare_price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'featured' => 'boolean',
        'is_new' => 'boolean',
        'is_bestseller' => 'boolean',
        'manage_stock' => 'boolean',
    ];

    public function category(): BelongsTo { return $this->belongsTo(Category::class); }
    public function brand(): BelongsTo { return $this->belongsTo(Brand::class); }
    public function images(): HasMany { return $this->hasMany(ProductImage::class)->orderBy('sort_order'); }
    public function primaryImage(): HasOne { return $this->hasOne(ProductImage::class)->where('is_primary', true); }
    public function variations(): HasMany { return $this->hasMany(ProductVariation::class); }
    public function reviews(): HasMany { return $this->hasMany(Review::class); }
    public function approvedReviews(): HasMany { return $this->reviews()->where('status', 'approved'); }
    public function scopeActive($query) { return $query->where('status', 'active'); }
}
