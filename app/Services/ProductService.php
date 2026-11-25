<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Str;

class ProductService
{
    public function store(array $data): Product
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        return Product::create($data);
    }

    public function update(Product $product, array $data): Product
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        $product->update($data);
        return $product;
    }
}
