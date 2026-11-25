<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BannerController extends Controller
{
    public function index(): Response { return Inertia::render('Admin/Banners/Index', ['items' => Banner::orderBy('sort_order')->paginate(15)]); }
    public function create(): Response { return Inertia::render('Admin/Banners/Form'); }
    public function store(Request $request) { Banner::create($request->validate(['title' => ['required', 'string'], 'subtitle' => ['nullable', 'string'], 'image' => ['required', 'string'], 'button_text' => ['nullable', 'string'], 'button_url' => ['nullable', 'string'], 'placement' => ['required', 'string'], 'status' => ['required', 'in:active,inactive'], 'sort_order' => ['nullable', 'integer']])); return redirect()->route('admin.banners.index'); }
    public function edit(Banner $banner): Response { return Inertia::render('Admin/Banners/Form', ['item' => $banner]); }
    public function update(Request $request, Banner $banner) { $banner->update($request->validate(['title' => ['required', 'string'], 'subtitle' => ['nullable', 'string'], 'image' => ['required', 'string'], 'button_text' => ['nullable', 'string'], 'button_url' => ['nullable', 'string'], 'placement' => ['required', 'string'], 'status' => ['required', 'in:active,inactive'], 'sort_order' => ['nullable', 'integer']])); return redirect()->route('admin.banners.index'); }
    public function destroy(Banner $banner) { $banner->delete(); return back(); }
}
