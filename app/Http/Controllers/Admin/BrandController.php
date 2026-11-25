<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function index(): Response { return Inertia::render('Admin/Brands/Index', ['items' => Brand::latest()->paginate(20)]); }
    public function create(): Response { return Inertia::render('Admin/Brands/Form'); }
    public function store(Request $request) { $data = $request->validate(['name' => ['required', 'string'], 'status' => ['required', 'in:active,inactive'], 'description' => ['nullable', 'string']]); $data['slug'] = Str::slug($data['name']); Brand::create($data); return redirect()->route('admin.brands.index'); }
    public function edit(Brand $brand): Response { return Inertia::render('Admin/Brands/Form', ['item' => $brand]); }
    public function update(Request $request, Brand $brand) { $data = $request->validate(['name' => ['required', 'string'], 'status' => ['required', 'in:active,inactive'], 'description' => ['nullable', 'string']]); $brand->update($data); return redirect()->route('admin.brands.index'); }
    public function destroy(Brand $brand) { $brand->delete(); return back(); }
}
