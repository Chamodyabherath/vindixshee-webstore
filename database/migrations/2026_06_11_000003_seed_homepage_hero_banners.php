<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        foreach ([
            [
                'title' => 'Season offers are live',
                'subtitle' => 'Save on curated picks across fashion, home, beauty, and tech.',
                'image' => 'https://picsum.photos/seed/season-offer/1800/900',
                'button_text' => 'Explore offers',
                'button_url' => '/#season-offers',
                'sort_order' => 2,
            ],
            [
                'title' => 'New arrivals every week',
                'subtitle' => 'Find modern products selected for everyday life.',
                'image' => 'https://picsum.photos/seed/new-arrivals/1800/900',
                'button_text' => 'Browse new',
                'button_url' => '/products?sort=latest',
                'sort_order' => 3,
            ],
        ] as $banner) {
            DB::table('banners')->updateOrInsert(
                ['title' => $banner['title'], 'placement' => 'home_hero'],
                [
                    ...$banner,
                    'placement' => 'home_hero',
                    'status' => 'active',
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }
    }

    public function down(): void
    {
        DB::table('banners')
            ->where('placement', 'home_hero')
            ->whereIn('title', ['Season offers are live', 'New arrivals every week'])
            ->delete();
    }
};
