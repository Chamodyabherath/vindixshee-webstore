<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $products = Product::active()
            ->with('primaryImage', 'brand')
            ->when($request->search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->when($request->brand, fn ($query, $brand) => $query->whereHas('brand', fn ($brandQuery) => $brandQuery->where('slug', $brand)))
            ->when($request->min_price, fn ($query, $price) => $query->where('price', '>=', $price))
            ->when($request->max_price, fn ($query, $price) => $query->where('price', '<=', $price))
            ->when($request->sort === 'price_low', fn ($query) => $query->orderBy('price'))
            ->when($request->sort === 'price_high', fn ($query) => $query->orderByDesc('price'))
            ->when(! $request->sort || $request->sort === 'latest', fn ($query) => $query->latest())
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Storefront/Products/Index', [
            'products' => $products,
            'brands' => Brand::active()->orderBy('name')->get(),
            'filters' => $request->only(['search', 'brand', 'min_price', 'max_price', 'sort']),
        ]);
    }

    public function show(Product $product): Response
    {
        abort_unless($product->status === 'active', 404);

        return Inertia::render('Storefront/Products/Show', [
            'product' => $product->load('images', 'variations', 'brand', 'category', 'approvedReviews'),
            'related' => Product::active()->with('primaryImage')->where('category_id', $product->category_id)->whereKeyNot($product->id)->take(4)->get(),
        ]);
    }

    public function offers(Request $request): Response
    {
        $products = Product::active()
            ->with('primaryImage', 'brand', 'category')
            ->whereNotNull('compare_price')
            ->whereColumn('compare_price', '>', 'price')
            ->when($request->brand, fn ($query, $brand) => $query->whereHas('brand', fn ($brandQuery) => $brandQuery->where('slug', $brand)))
            ->when($request->sort === 'price_low', fn ($query) => $query->orderBy('price'))
            ->when($request->sort === 'price_high', fn ($query) => $query->orderByDesc('price'))
            ->when(! in_array($request->sort, ['price_low', 'price_high'], true), fn ($query) => $query->orderByRaw('(compare_price - price) desc'))
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Storefront/Offers/Index', [
            'products' => $products,
            'brands' => Brand::active()->orderBy('name')->get(),
            'filters' => $request->only(['brand', 'sort']),
        ]);
    }
}
