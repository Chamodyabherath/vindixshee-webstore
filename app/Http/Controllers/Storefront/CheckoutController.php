<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Models\Order;
use App\Models\ShippingMethod;
use App\Services\CartService;
use App\Services\CheckoutService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function create(Request $request, CartService $cartService): Response
    {
        return Inertia::render('Storefront/Checkout', [
            'cart' => $cartService->cart($request)->load('items.product.primaryImage', 'items.variation'),
            'shippingMethods' => ShippingMethod::where('status', 'active')->get(),
        ]);
    }

    public function store(CheckoutRequest $request, CheckoutService $checkout): RedirectResponse
    {
        $order = $checkout->place($request, $request->validated());
        return redirect()->route('checkout.thank-you', $order);
    }

    public function thankYou(Order $order): Response
    {
        return Inertia::render('Storefront/ThankYou', ['order' => $order->load('items')]);
    }
}
