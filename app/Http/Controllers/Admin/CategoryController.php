<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response { return Inertia::render('Admin/Categories/Index', ['items' => Category::with('parent')->orderBy('sort_order')->paginate(20)]); }
    public function create(): Response { return Inertia::render('Admin/Categories/Form', ['parents' => Category::orderBy('name')->get()]); }
    public function store(StoreCategoryRequest $request) { $data = $request->validated(); $data['slug'] = Str::slug($data['name']); Category::create($data); return redirect()->route('admin.categories.index'); }
    public function edit(Category $category): Response { return Inertia::render('Admin/Categories/Form', ['item' => $category, 'parents' => Category::whereKeyNot($category->id)->orderBy('name')->get()]); }
    public function update(UpdateCategoryRequest $request, Category $category) { $data = $request->validated(); $data['slug'] = $category->slug ?: Str::slug($data['name']); $category->update($data); return redirect()->route('admin.categories.index'); }
    public function updateStatus(Request $request, Category $category): RedirectResponse { $category->update($request->validate(['status' => ['required', 'in:active,inactive']])); return back(); }
    public function destroy(Category $category) { $category->delete(); return back(); }
}
