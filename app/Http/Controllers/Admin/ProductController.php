<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response { return Inertia::render('Admin/Products/Index', ['items' => Product::with('category', 'brand')->latest()->paginate(15)]); }
    public function create(): Response { return Inertia::render('Admin/Products/Form', ['categories' => Category::orderBy('name')->get(), 'brands' => Brand::orderBy('name')->get()]); }
    public function store(StoreProductRequest $request, ProductService $service) { $service->store($request->validated()); return redirect()->route('admin.products.index'); }
    public function edit(Product $product): Response { return Inertia::render('Admin/Products/Form', ['item' => $product, 'categories' => Category::orderBy('name')->get(), 'brands' => Brand::orderBy('name')->get()]); }
    public function update(UpdateProductRequest $request, Product $product, ProductService $service) { $service->update($product, $request->validated()); return redirect()->route('admin.products.index'); }
    public function updateStatus(Request $request, Product $product): RedirectResponse { $product->update($request->validate(['status' => ['required', 'in:draft,active,inactive']])); return back(); }
    public function updateStock(Request $request, Product $product): RedirectResponse { $product->update($request->validate(['stock_quantity' => ['required', 'integer', 'min:0']])); return back(); }
    public function updateOffer(Request $request, Product $product): RedirectResponse
    {
        $data = $request->validate(['compare_price' => ['nullable', 'numeric', 'min:0']]);

        if ($data['compare_price'] !== null && (float) $data['compare_price'] <= (float) $product->price) {
            throw ValidationException::withMessages(['compare_price' => 'Offer compare price must be higher than the sale price.']);
        }

        $product->update($data);
        return back();
    }
    public function destroy(Product $product) { $product->delete(); return back(); }
}
