<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StockAdjustmentRequest;
use App\Models\InventoryMovement;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Services\InventoryService;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    public function index(): Response { return Inertia::render('Admin/Inventory/Index', ['items' => InventoryMovement::with('product')->latest()->paginate(20), 'products' => Product::orderBy('name')->get(['id', 'name', 'sku', 'stock_quantity'])]); }
    public function store(StockAdjustmentRequest $request, InventoryService $service) { $data = $request->validated(); $product = Product::findOrFail($data['product_id']); $variation = isset($data['product_variation_id']) ? ProductVariation::find($data['product_variation_id']) : null; $service->adjust($product, $variation, (int) $data['quantity'], 'manual_adjustment', $data['note'], $request->user()->id); return back(); }
}
