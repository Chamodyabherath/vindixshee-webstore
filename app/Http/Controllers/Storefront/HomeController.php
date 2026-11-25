<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $heroBanners = Banner::where('placement', 'home_hero')
            ->where('status', 'active')
            ->orderBy('sort_order')
            ->get();

        if ($heroBanners->isEmpty()) {
            $heroBanners = collect([
                [
                    'title' => 'VINDIXSHEE',
                    'subtitle' => 'Fresh products, fast checkout, beautiful storefront.',
                    'image' => 'https://picsum.photos/seed/hero-commerce/1800/900',
                    'button_text' => 'Shop now',
                    'button_url' => '/products',
                ],
            ]);
        }

        return Inertia::render('Storefront/Home', [
            'hero' => $heroBanners->first(),
            'heroBanners' => $heroBanners->values(),
            'categories' => Category::active()->whereNull('parent_id')->with('children')->orderBy('sort_order')->get(),
            'featured' => Product::active()->with('primaryImage')->where('featured', true)->latest()->take(8)->get(),
            'newArrivals' => Product::active()->with('primaryImage')->where('is_new', true)->latest()->take(8)->get(),
            'bestSellers' => Product::active()->with('primaryImage')->where('is_bestseller', true)->latest()->take(8)->get(),
            'seasonOffers' => Product::active()
                ->with('primaryImage', 'brand')
                ->whereNotNull('compare_price')
                ->orderByRaw('(compare_price - price) desc')
                ->take(6)
                ->get(),
        ]);
    }
}
