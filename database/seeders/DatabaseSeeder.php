<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\Page;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductAttributeValue;
use App\Models\ProductImage;
use App\Models\ProductVariation;
use App\Models\ProductVariationValue;
use App\Models\Review;
use App\Models\Setting;
use App\Models\ShippingMethod;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create(['name' => 'Admin User', 'email' => 'admin@example.com', 'password' => Hash::make('password'), 'role' => 'super_admin', 'status' => 'active', 'email_verified_at' => now()]);
        $customer = User::create(['name' => 'Demo Customer', 'email' => 'customer@example.com', 'password' => Hash::make('password'), 'role' => 'customer', 'status' => 'active', 'email_verified_at' => now()]);

        $roots = collect(['Electronics', 'Fashion', 'Home Living', 'Beauty'])->map(fn ($name) => Category::create(['name' => $name, 'slug' => Str::slug($name), 'status' => 'active', 'sort_order' => 1]));
        foreach ($roots as $root) {
            foreach (['New Arrivals', 'Premium', 'Essentials'] as $child) {
                Category::create(['parent_id' => $root->id, 'name' => $root->name.' '.$child, 'slug' => Str::slug($root->name.' '.$child), 'status' => 'active']);
            }
        }

        $brands = collect(['Nova', 'Aster', 'Luma', 'Vertex'])->map(fn ($name) => Brand::create(['name' => $name, 'slug' => Str::slug($name), 'status' => 'active']));
        $color = ProductAttribute::create(['name' => 'Color', 'slug' => 'color', 'type' => 'color']);
        $size = ProductAttribute::create(['name' => 'Size', 'slug' => 'size', 'type' => 'size']);
        $red = ProductAttributeValue::create(['product_attribute_id' => $color->id, 'value' => 'Red', 'color_code' => '#ef4444']);
        $large = ProductAttributeValue::create(['product_attribute_id' => $size->id, 'value' => 'Large']);

        for ($i = 1; $i <= 24; $i++) {
            $product = Product::create([
                'category_id' => $roots->random()->id,
                'brand_id' => $brands->random()->id,
                'name' => 'Modern Product '.$i,
                'slug' => 'modern-product-'.$i,
                'sku' => 'SKU-'.$i,
                'short_description' => 'A polished demo product for VINDIXSHEE.',
                'description' => 'Premium details, reliable stock, and a clean shopping experience.',
                'price' => rand(25, 250),
                'compare_price' => rand(260, 350),
                'stock_quantity' => rand(3, 60),
                'status' => 'active',
                'featured' => $i % 3 === 0,
                'is_new' => $i % 4 === 0,
                'is_bestseller' => $i % 5 === 0,
            ]);

            ProductImage::create(['product_id' => $product->id, 'image_path' => 'https://picsum.photos/seed/product-'.$i.'/900/900', 'alt_text' => $product->name, 'is_primary' => true]);
            $variation = ProductVariation::create(['product_id' => $product->id, 'sku' => 'SKU-'.$i.'-RED-L', 'price' => $product->price, 'stock_quantity' => 8, 'status' => 'active']);
            ProductVariationValue::create(['product_variation_id' => $variation->id, 'product_attribute_id' => $color->id, 'product_attribute_value_id' => $red->id]);
            ProductVariationValue::create(['product_variation_id' => $variation->id, 'product_attribute_id' => $size->id, 'product_attribute_value_id' => $large->id]);
            Review::create(['product_id' => $product->id, 'user_id' => $customer->id, 'customer_name' => $customer->name, 'customer_email' => $customer->email, 'rating' => rand(4, 5), 'title' => 'Excellent', 'comment' => 'Great quality and fast checkout.', 'status' => 'approved', 'approved_at' => now()]);
        }

        Coupon::create(['code' => 'WELCOME10', 'name' => 'Welcome 10%', 'type' => 'percentage', 'value' => 10, 'minimum_order_amount' => 50, 'maximum_discount_amount' => 40, 'usage_limit' => 100, 'status' => 'active']);
        ShippingMethod::create(['name' => 'Standard Shipping', 'code' => 'standard', 'price' => 5, 'status' => 'active']);
        ShippingMethod::create(['name' => 'Express Shipping', 'code' => 'express', 'price' => 15, 'status' => 'active']);
        Banner::create(['title' => 'VINDIXSHEE', 'subtitle' => 'Fresh fashion, fast checkout, beautiful storefront.', 'image' => 'https://picsum.photos/seed/hero-commerce/1800/900', 'button_text' => 'Shop now', 'button_url' => '/products', 'placement' => 'home_hero', 'status' => 'active']);
        Page::create(['title' => 'About us', 'slug' => 'about-us', 'content' => 'VINDIXSHEE is a demo ecommerce platform.', 'status' => 'active']);

        foreach ([
            'store_name' => ['VINDIXSHEE', 'general', 'string'],
            'currency' => ['USD', 'general', 'string'],
            'contact_email' => ['hello@example.com', 'general', 'string'],
            'login_background_image' => ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=85', 'auth', 'url'],
            'login_eyebrow' => ['Staff and customer portal', 'auth', 'string'],
            'login_headline' => ['Welcome back to VINDIXSHEE', 'auth', 'string'],
            'login_subtitle' => ['Manage orders, discover products, and keep your store moving from one polished dashboard.', 'auth', 'text'],
            'login_panel_note' => ['Demo admin: admin@example.com / password', 'auth', 'string'],
        ] as $key => [$value, $group, $type]) {
            Setting::create(['key' => $key, 'value' => $value, 'group' => $group, 'type' => $type]);
        }
    }
}
