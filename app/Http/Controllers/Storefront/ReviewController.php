<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Services\ReviewService;
use Illuminate\Http\RedirectResponse;

class ReviewController extends Controller
{
    public function store(StoreReviewRequest $request, ReviewService $service): RedirectResponse
    {
        $service->create($request->validated(), $request->user()?->id);
        return back()->with('success', 'Review submitted.');
    }
}
