<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Services\ReportService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(ReportService $reports): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => $reports->dashboard(),
            'recentOrders' => Order::latest()->take(8)->get(),
            'lowStock' => Product::whereColumn('stock_quantity', '<=', 'low_stock_alert_qty')->take(8)->get(),
        ]);
    }
}
