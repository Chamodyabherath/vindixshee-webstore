<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('settings')->updateOrInsert(
            ['key' => 'store_name'],
            ['value' => 'VINDIXSHEE', 'group' => 'general', 'type' => 'string', 'updated_at' => now(), 'created_at' => now()]
        );

        DB::table('settings')->where('key', 'login_headline')->update([
            'value' => 'Welcome back to VINDIXSHEE',
            'updated_at' => now(),
        ]);

        DB::table('banners')->where('title', 'Modern Commerce')->update([
            'title' => 'VINDIXSHEE',
            'subtitle' => 'Fresh fashion, fast checkout, beautiful storefront.',
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('settings')->where('key', 'store_name')->update([
            'value' => 'Modern Commerce',
            'updated_at' => now(),
        ]);

        DB::table('settings')->where('key', 'login_headline')->update([
            'value' => 'Welcome back to Modern Commerce',
            'updated_at' => now(),
        ]);
    }
};
