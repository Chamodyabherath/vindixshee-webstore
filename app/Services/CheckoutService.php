<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use App\Models\ShippingMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckoutService
{
    public function __construct(
        private CartService $cartService,
        private CouponService $couponService,
        private InventoryService $inventoryService
    ) {}

    public function place(Request $request, array $data): Order
    {
        return DB::transaction(function () use ($request, $data): Order {
            $cart = $this->cartService->cart($request)->load('items.product', 'items.variation');

            if ($cart->items->isEmpty()) {
                throw ValidationException::withMessages(['cart' => 'Your cart is empty.']);
            }

            $subtotal = $cart->items->sum(fn ($item) => (float) $item->unit_price * $item->quantity);
            $coupon = $this->couponService->validate($data['coupon_code'] ?? $cart->coupon_code, $subtotal);
            $discount = $this->couponService->discount($coupon, $subtotal);
            $shipping = ShippingMethod::find($data['shipping_method_id'] ?? null)?->price ?? '0.00';
            $total = number_format($subtotal - (float) $discount + (float) $shipping, 2, '.', '');

            $order = Order::create([
                'order_number' => 'MC-'.now()->format('Ymd').'-'.strtoupper(substr(bin2hex(random_bytes(4)), 0, 8)),
                'user_id' => $request->user()?->id,
                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'] ?? null,
                'customer_phone' => $data['customer_phone'],
                'billing_address' => $data['billing_address'],
                'shipping_address' => $data['shipping_address'],
                'subtotal' => $subtotal,
                'discount_amount' => $discount,
                'shipping_amount' => $shipping,
                'tax_amount' => 0,
                'total_amount' => $total,
                'payment_method' => $data['payment_method'],
                'payment_status' => 'pending',
                'order_status' => 'pending',
                'coupon_code' => $coupon?->code,
                'customer_note' => $data['customer_note'] ?? null,
                'placed_at' => now(),
            ]);

            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'product_variation_id' => $item->product_variation_id,
                    'product_name' => $item->product->name,
                    'product_sku' => $item->variation?->sku ?? $item->product->sku,
                    'variation_label' => null,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total_price' => (float) $item->unit_price * $item->quantity,
                ]);

                if ($item->product->manage_stock) {
                    $this->inventoryService->adjust($item->product, $item->variation, -$item->quantity, 'stock_out', 'Order '.$order->order_number, $request->user()?->id, $order);
                }
            }

            $order->histories()->create(['to_status' => 'pending', 'note' => 'Order placed', 'changed_by' => $request->user()?->id]);
            Payment::create(['order_id' => $order->id, 'payment_method' => $order->payment_method, 'payment_status' => 'pending', 'amount' => $order->total_amount]);
            $coupon?->increment('used_count');
            $this->cartService->clear($cart);

            return $order->load('items');
        });
    }
}
