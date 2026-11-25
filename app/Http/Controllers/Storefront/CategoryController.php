<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function show(Request $request, Category $category): Response
    {
        $category->load('children');

        $products = Product::active()
            ->with('primaryImage', 'brand')
            ->where('category_id', $category->id)
            ->when($request->brand, fn ($query, $brand) => $query->whereHas('brand', fn ($brandQuery) => $brandQuery->where('slug', $brand)))
            ->when($request->sort === 'price_low', fn ($query) => $query->orderBy('price'))
            ->when($request->sort === 'price_high', fn ($query) => $query->orderByDesc('price'))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Storefront/Categories/Show', [
            'category' => $category,
            'products' => $products,
            'brands' => Brand::active()->orderBy('name')->get(),
            'filters' => $request->only(['brand', 'sort']),
        ]);
    }
}
