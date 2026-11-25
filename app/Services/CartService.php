<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariation;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CartService
{
    public function cart(Request $request): Cart
    {
        if (! $request->user() && $request->session()->has('cart_id')) {
            $cart = Cart::find($request->session()->get('cart_id'));

            if ($cart) {
                return $cart;
            }
        }

        $identity = $request->user() ? ['user_id' => $request->user()->id] : ['session_id' => $request->session()->getId()];
        $cart = Cart::firstOrCreate($identity);

        if (! $request->user()) {
            $request->session()->put('cart_id', $cart->id);
        }

        return $cart;
    }

    public function add(Request $request, Product $product, int $quantity = 1, ?ProductVariation $variation = null): Cart
    {
        if ($product->status !== 'active') {
            throw ValidationException::withMessages(['product' => 'Product is unavailable.']);
        }

        $available = (int) ($variation?->stock_quantity ?? $product->stock_quantity);

        if ($product->manage_stock && $quantity > $available) {
            throw ValidationException::withMessages(['quantity' => 'Quantity exceeds available stock.']);
        }

        $cart = $this->cart($request);
        $item = CartItem::firstOrNew([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'product_variation_id' => $variation?->id,
        ]);

        $item->quantity = ($item->exists ? $item->quantity : 0) + $quantity;
        $item->unit_price = $variation?->price ?? $product->price;
        $item->save();

        return $cart->load('items.product.primaryImage', 'items.variation');
    }

    public function update(CartItem $item, int $quantity): void
    {
        if ($quantity < 1) {
            $item->delete();
            return;
        }

        $item->update(['quantity' => $quantity]);
    }

    public function clear(Cart $cart): void
    {
        $cart->items()->delete();
        $cart->update(['coupon_code' => null]);
    }
}
