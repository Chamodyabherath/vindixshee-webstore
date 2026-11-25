<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $statusMap = [
            'packing' => ['packing', 'packed', 'processing'],
            'in_courier' => ['in_courier', 'shipped'],
        ];

        return Inertia::render('Admin/Orders/Index', [
            'items' => Order::query()
                ->when($request->status, fn ($query, $status) => $query->whereIn('order_status', $statusMap[$status] ?? [$status]))
                ->when($request->search, fn ($query, $search) => $query->where(fn ($q) => $q->where('order_number', 'like', "%{$search}%")->orWhere('customer_name', 'like', "%{$search}%")->orWhere('customer_phone', 'like', "%{$search}%")))
                ->latest()
                ->paginate(15)
                ->withQueryString(),
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function show(Order $order): Response { return Inertia::render('Admin/Orders/Show', ['order' => $order->load('items', 'histories', 'payments')]); }
    public function updateStatus(UpdateOrderStatusRequest $request, Order $order, OrderService $service) { $service->updateStatus($order, $request->validated('order_status'), $request->validated('note'), $request->user()->id); return back(); }
}
