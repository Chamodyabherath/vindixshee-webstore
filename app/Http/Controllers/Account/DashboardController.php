<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Account/Dashboard', [
            'orderCount' => $user->orders()->count(),
            'pendingOrderCount' => $user->orders()->where('order_status', 'pending')->count(),
            'activeOrderCount' => $user->orders()->whereIn('order_status', ['confirmed', 'packing', 'packed', 'processing', 'in_courier', 'shipped'])->count(),
            'deliveredOrderCount' => $user->orders()->where('order_status', 'delivered')->count(),
            'cancelledOrderCount' => $user->orders()->whereIn('order_status', ['cancelled', 'returned'])->count(),
            'wishlistCount' => $user->wishlists()->count(),
            'reviewCount' => $user->reviews()->count(),
            'addressCount' => $user->addresses()->count(),
            'totalSpent' => $user->orders()->whereNotIn('order_status', ['cancelled', 'returned'])->sum('total_amount'),
            'recentOrders' => $user->orders()->latest()->take(5)->get(),
            'wishlistItems' => $user->wishlists()->with('product.primaryImage')->latest()->take(4)->get(),
            'recentReviews' => $user->reviews()->with('product')->latest()->take(4)->get(),
        ]);
    }
}
