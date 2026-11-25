<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        foreach ([
            'login_background_image' => ['https://picsum.photos/seed/login-commerce/1800/1200', 'auth', 'url'],
            'login_eyebrow' => ['Staff and customer portal', 'auth', 'string'],
            'login_headline' => ['Welcome back to VINDIXSHEE', 'auth', 'string'],
            'login_subtitle' => ['Manage orders, discover products, and keep your store moving from one polished dashboard.', 'auth', 'text'],
            'login_panel_note' => ['Demo admin: admin@example.com / password', 'auth', 'string'],
        ] as $key => [$value, $group, $type]) {
            DB::table('settings')->updateOrInsert(
                ['key' => $key],
                ['value' => $value, 'group' => $group, 'type' => $type, 'updated_at' => now(), 'created_at' => now()]
            );
        }
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', [
            'login_background_image',
            'login_eyebrow',
            'login_headline',
            'login_subtitle',
            'login_panel_note',
        ])->delete();
    }
};
