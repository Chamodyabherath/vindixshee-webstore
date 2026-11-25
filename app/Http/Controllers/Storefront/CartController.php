<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(private CartService $cartService) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Storefront/Cart', [
            'cart' => $this->cartService->cart($request)->load('items.product.primaryImage', 'items.variation'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate(['product_id' => ['required', 'exists:products,id'], 'product_variation_id' => ['nullable', 'exists:product_variations,id'], 'quantity' => ['required', 'integer', 'min:1']]);
        $this->cartService->add($request, Product::findOrFail($data['product_id']), $data['quantity'], isset($data['product_variation_id']) ? ProductVariation::find($data['product_variation_id']) : null);

        return back()->with('success', 'Added to cart.');
    }

    public function update(Request $request, CartItem $item): RedirectResponse
    {
        $this->cartService->update($item, (int) $request->validate(['quantity' => ['required', 'integer', 'min:0']])['quantity']);
        return back();
    }

    public function destroy(CartItem $item): RedirectResponse
    {
        $item->delete();
        return back();
    }
}
