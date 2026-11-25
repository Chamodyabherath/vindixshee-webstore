<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(Request $request): Response { return Inertia::render('Admin/Reviews/Index', ['items' => Review::with('product')->when($request->status, fn ($q, $s) => $q->where('status', $s))->latest()->paginate(15)]); }
    public function update(Request $request, Review $review) { $data = $request->validate(['status' => ['required', 'in:pending,approved,rejected']]); $review->update(['status' => $data['status'], 'approved_at' => $data['status'] === 'approved' ? now() : null]); return back(); }
    public function destroy(Review $review) { $review->delete(); return back(); }
}
