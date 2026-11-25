<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'storeSettings' => fn () => Cache::remember('store_settings.shared', 300, function () {
                return \App\Models\Setting::query()
                    ->whereIn('key', [
                        'store_name',
                        'login_background_image',
                        'login_eyebrow',
                        'login_headline',
                        'login_subtitle',
                        'login_panel_note',
                    ])
                    ->pluck('value', 'key');
            }),
        ];
    }
}
