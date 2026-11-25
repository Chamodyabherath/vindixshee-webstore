<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommerceTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_listing_loads(): void
    {
        $this->withoutVite();
        $this->get('/products')->assertOk();
    }

    public function test_season_offers_page_loads(): void
    {
        $this->product(['compare_price' => 150, 'price' => 99]);

        $this->withoutVite();
        $this->get('/season-offers')->assertOk();
    }

    public function test_category_page_loads(): void
    {
        Category::create(['name' => 'Tech', 'slug' => 'tech', 'status' => 'active']);
        $this->withoutVite();
        $this->get('/categories/tech')->assertOk();
    }

    public function test_add_to_cart_works(): void
    {
        $product = $this->product();
        $this->post('/cart', ['product_id' => $product->id, 'quantity' => 1])->assertRedirect();
        $this->assertDatabaseHas('cart_items', ['product_id' => $product->id, 'quantity' => 1]);
    }

    public function test_checkout_creates_order_and_reduces_stock(): void
    {
        $product = $this->product(['stock_quantity' => 5]);
        $this->post('/cart', ['product_id' => $product->id, 'quantity' => 2]);
        $this->post('/checkout', [
            'customer_name' => 'Buyer',
            'customer_email' => 'buyer@example.com',
            'customer_phone' => '123',
            'billing_address' => ['address_line_1' => 'A', 'city' => 'Colombo'],
            'shipping_address' => ['address_line_1' => 'A', 'city' => 'Colombo'],
            'payment_method' => 'cod',
        ])->assertSessionHasNoErrors()->assertRedirect();

        $this->assertDatabaseCount('orders', 1);
        $this->assertSame(3, $product->fresh()->stock_quantity);
        $this->assertDatabaseHas('inventory_movements', ['product_id' => $product->id, 'type' => 'stock_out']);
    }

    public function test_coupon_applies_correctly(): void
    {
        Coupon::create(['code' => 'SAVE10', 'name' => 'Save', 'type' => 'fixed', 'value' => 10, 'status' => 'active']);
        $this->assertDatabaseHas('coupons', ['code' => 'SAVE10']);
    }

    public function test_order_status_update_creates_history_and_cancel_restores_stock(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $product = $this->product(['stock_quantity' => 5]);
        $this->post('/cart', ['product_id' => $product->id, 'quantity' => 2]);
        $this->post('/checkout', [
            'customer_name' => 'Buyer',
            'customer_phone' => '123',
            'billing_address' => ['address_line_1' => 'A'],
            'shipping_address' => ['address_line_1' => 'A'],
            'payment_method' => 'cod',
        ])->assertSessionHasNoErrors();
        $order = Order::first();

        $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", ['order_status' => 'cancelled'])->assertRedirect();
        $this->assertDatabaseHas('order_status_histories', ['order_id' => $order->id, 'to_status' => 'cancelled']);
        $this->assertSame(5, $product->fresh()->stock_quantity);
    }

    public function test_admin_can_move_order_through_advanced_statuses(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $order = Order::create(['order_number' => 'MC-2', 'customer_name' => 'Buyer', 'customer_phone' => '123', 'billing_address' => [], 'shipping_address' => [], 'subtotal' => 1, 'total_amount' => 1, 'payment_method' => 'cod', 'payment_status' => 'pending', 'order_status' => 'pending', 'placed_at' => now()]);

        foreach (['confirmed', 'packing', 'in_courier', 'delivered'] as $status) {
            $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", ['order_status' => $status])->assertRedirect();
        }

        $this->assertSame('delivered', $order->fresh()->order_status);
        $this->assertDatabaseHas('order_status_histories', ['order_id' => $order->id, 'to_status' => 'in_courier']);
    }

    public function test_customer_can_cancel_only_pending_order(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $product = $this->product(['stock_quantity' => 8]);
        $order = Order::create(['order_number' => 'MC-3', 'user_id' => $customer->id, 'customer_name' => 'Buyer', 'customer_phone' => '123', 'billing_address' => [], 'shipping_address' => [], 'subtotal' => 99, 'total_amount' => 99, 'payment_method' => 'cod', 'payment_status' => 'pending', 'order_status' => 'pending', 'placed_at' => now()]);
        $order->items()->create(['product_id' => $product->id, 'product_name' => $product->name, 'product_sku' => $product->sku, 'quantity' => 1, 'unit_price' => 99, 'total_price' => 99]);

        $this->actingAs($customer)->patch("/account/orders/{$order->id}/cancel")->assertRedirect();
        $this->assertSame('cancelled', $order->fresh()->order_status);
        $this->assertSame(9, $product->fresh()->stock_quantity);

        $confirmed = Order::create(['order_number' => 'MC-4', 'user_id' => $customer->id, 'customer_name' => 'Buyer', 'customer_phone' => '123', 'billing_address' => [], 'shipping_address' => [], 'subtotal' => 99, 'total_amount' => 99, 'payment_method' => 'cod', 'payment_status' => 'pending', 'order_status' => 'confirmed', 'placed_at' => now()]);
        $this->actingAs($customer)->patch("/account/orders/{$confirmed->id}/cancel")->assertSessionHasErrors('order_status');
    }

    public function test_review_creation_works(): void
    {
        $product = $this->product();
        $this->post('/reviews', ['product_id' => $product->id, 'customer_name' => 'Guest', 'rating' => 5, 'comment' => 'Great'])->assertRedirect();
        $this->assertDatabaseHas('reviews', ['product_id' => $product->id, 'status' => 'pending']);
    }

    public function test_admin_cannot_access_without_role(): void
    {
        $user = User::factory()->create(['role' => 'customer']);
        $this->actingAs($user)->get('/admin/dashboard')->assertForbidden();
    }

    public function test_customer_cannot_view_another_customer_order(): void
    {
        $owner = User::factory()->create(['role' => 'customer']);
        $other = User::factory()->create(['role' => 'customer']);
        $order = Order::create(['order_number' => 'MC-1', 'user_id' => $owner->id, 'customer_name' => 'Owner', 'customer_phone' => '1', 'billing_address' => [], 'shipping_address' => [], 'subtotal' => 1, 'total_amount' => 1, 'payment_method' => 'cod', 'payment_status' => 'pending', 'order_status' => 'pending', 'placed_at' => now()]);

        $this->actingAs($other)->get("/account/orders/{$order->id}")->assertForbidden();
    }

    private function product(array $overrides = []): Product
    {
        $category = Category::first() ?? Category::create(['name' => 'Tech', 'slug' => 'tech', 'status' => 'active']);

        return Product::create(array_merge([
            'category_id' => $category->id,
            'name' => 'Phone',
            'slug' => 'phone-'.uniqid(),
            'sku' => 'P-'.uniqid(),
            'price' => 99,
            'stock_quantity' => 10,
            'status' => 'active',
        ], $overrides));
    }
}
