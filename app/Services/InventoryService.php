<?php

namespace App\Services;

use App\Models\InventoryMovement;
use App\Models\Product;
use App\Models\ProductVariation;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InventoryService
{
    public function adjust(Product $product, ?ProductVariation $variation, int $quantity, string $type, ?string $note = null, ?int $userId = null, ?object $reference = null): void
    {
        DB::transaction(function () use ($product, $variation, $quantity, $type, $note, $userId, $reference): void {
            $stockable = $variation
                ? ProductVariation::whereKey($variation->id)->lockForUpdate()->firstOrFail()
                : Product::whereKey($product->id)->lockForUpdate()->firstOrFail();

            $previous = (int) $stockable->stock_quantity;
            $new = $previous + $quantity;

            if ($new < 0 && $product->manage_stock) {
                throw ValidationException::withMessages(['stock' => 'Insufficient stock.']);
            }

            $stockable->update(['stock_quantity' => $new]);

            InventoryMovement::create([
                'product_id' => $product->id,
                'product_variation_id' => $variation?->id,
                'type' => $type,
                'quantity' => abs($quantity),
                'previous_stock' => $previous,
                'new_stock' => $new,
                'reference_type' => $reference ? get_class($reference) : null,
                'reference_id' => $reference?->id,
                'note' => $note,
                'created_by' => $userId,
            ]);
        });
    }
}
