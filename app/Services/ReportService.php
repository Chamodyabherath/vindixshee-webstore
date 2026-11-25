<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;

class ReportService
{
    public function dashboard(): array
    {
        return [
            'totalSales' => Order::where('payment_status', 'paid')->sum('total_amount'),
            'todaySales' => Order::whereDate('created_at', today())->sum('total_amount'),
            'totalOrders' => Order::count(),
            'pendingOrders' => Order::where('order_status', 'pending')->count(),
            'confirmedOrders' => Order::where('order_status', 'confirmed')->count(),
            'packingOrders' => Order::whereIn('order_status', ['packing', 'packed', 'processing'])->count(),
            'inCourierOrders' => Order::whereIn('order_status', ['in_courier', 'shipped'])->count(),
            'deliveredOrders' => Order::where('order_status', 'delivered')->count(),
            'returnedOrders' => Order::where('order_status', 'returned')->count(),
            'cancelledOrders' => Order::where('order_status', 'cancelled')->count(),
            'totalProducts' => Product::count(),
            'lowStockProducts' => Product::whereColumn('stock_quantity', '<=', 'low_stock_alert_qty')->count(),
            'pendingReviews' => Review::where('status', 'pending')->count(),
            'totalCustomers' => User::where('role', 'customer')->count(),
        ];
    }
}
