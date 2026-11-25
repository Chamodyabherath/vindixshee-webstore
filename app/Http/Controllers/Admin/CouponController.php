<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCouponRequest;
use App\Http\Requests\UpdateCouponRequest;
use App\Models\Coupon;
use Inertia\Inertia;
use Inertia\Response;

class CouponController extends Controller
{
    public function index(): Response { return Inertia::render('Admin/Coupons/Index', ['items' => Coupon::latest()->paginate(15)]); }
    public function create(): Response { return Inertia::render('Admin/Coupons/Form'); }
    public function store(StoreCouponRequest $request) { Coupon::create(array_merge($request->validated(), ['code' => strtoupper($request->validated('code'))])); return redirect()->route('admin.coupons.index'); }
    public function edit(Coupon $coupon): Response { return Inertia::render('Admin/Coupons/Form', ['item' => $coupon]); }
    public function update(UpdateCouponRequest $request, Coupon $coupon) { $coupon->update(array_merge($request->validated(), ['code' => strtoupper($request->validated('code'))])); return redirect()->route('admin.coupons.index'); }
    public function destroy(Coupon $coupon) { $coupon->delete(); return back(); }
}
