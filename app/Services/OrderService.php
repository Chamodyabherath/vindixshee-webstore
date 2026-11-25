<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function __construct(private InventoryService $inventoryService) {}

    public function updateStatus(Order $order, string $status, ?string $note = null, ?int $userId = null): Order
    {
        $from = $order->order_status;
        $status = $this->normalizeStatus($status);
        $from = $this->normalizeStatus($from);

        if (in_array($from, ['cancelled', 'returned'], true)) {
            throw ValidationException::withMessages(['order_status' => 'Closed orders cannot move.']);
        }

        if ($status === $from) {
            return $order;
        }

        $allowed = [
            'pending' => ['confirmed', 'cancelled'],
            'confirmed' => ['packing', 'cancelled'],
            'packing' => ['in_courier', 'cancelled'],
            'in_courier' => ['delivered', 'returned'],
            'delivered' => ['returned'],
        ];

        if (! in_array($status, $allowed[$from] ?? [], true)) {
            throw ValidationException::withMessages(['order_status' => 'This order cannot move from '.$from.' to '.$status.'.']);
        }

        $timestampField = $this->timestampField($status);
        $update = ['order_status' => $status];

        if ($timestampField) {
            $update[$timestampField] = now();
        }

        $order->update($update);
        $order->histories()->create(['from_status' => $from, 'to_status' => $status, 'note' => $note, 'changed_by' => $userId]);

        if ($status === 'cancelled') {
            $this->restoreStock($order, $userId, 'order_cancelled', 'Cancelled '.$order->order_number);
        }

        if ($status === 'returned') {
            $this->restoreStock($order, $userId, 'order_returned', 'Returned '.$order->order_number);
        }

        return $order;
    }

    public function cancelPendingByCustomer(Order $order, int $userId): Order
    {
        if ((int) $order->user_id !== $userId) {
            throw ValidationException::withMessages(['order_status' => 'This order does not belong to your account.']);
        }

        if ($this->normalizeStatus($order->order_status) !== 'pending') {
            throw ValidationException::withMessages(['order_status' => 'Only pending orders can be cancelled by the customer.']);
        }

        return $this->updateStatus($order, 'cancelled', 'Cancelled by customer', $userId);
    }

    private function restoreStock(Order $order, ?int $userId, string $type, string $note): void
    {
        foreach ($order->items()->with('product', 'variation')->get() as $item) {
            $this->inventoryService->adjust($item->product, $item->variation, $item->quantity, $type, $note, $userId, $order);
        }
    }

    private function normalizeStatus(string $status): string
    {
        return match ($status) {
            'packed', 'processing' => 'packing',
            'shipped' => 'in_courier',
            default => $status,
        };
    }

    private function timestampField(string $status): ?string
    {
        return match ($status) {
            'confirmed' => 'confirmed_at',
            'packing' => 'packed_at',
            'in_courier' => 'shipped_at',
            'delivered' => 'delivered_at',
            'cancelled' => 'cancelled_at',
            default => null,
        };
    }
}
