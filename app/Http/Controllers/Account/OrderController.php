<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Account/Orders', [
            'orders' => $request->user()->orders()->latest()->paginate(10),
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        abort_unless($order->user_id === $request->user()->id, 403);
        return Inertia::render('Account/OrderShow', ['order' => $order->load('items', 'histories')]);
    }

    public function cancel(Request $request, Order $order, OrderService $service): RedirectResponse
    {
        $service->cancelPendingByCustomer($order, $request->user()->id);

        return back();
    }
}
