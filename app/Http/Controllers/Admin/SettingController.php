<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function __invoke(): Response { return Inertia::render('Admin/Settings/Index', ['items' => Setting::orderBy('group')->orderBy('key')->get()]); }
    public function update(Request $request)
    {
        foreach ($request->validate(['settings' => ['required', 'array']])['settings'] as $key => $value) {
            Setting::updateOrCreate(['key' => $key], [
                'value' => $value,
                'group' => str_starts_with($key, 'login_') ? 'auth' : 'general',
                'type' => str_contains($key, 'image') ? 'url' : 'string',
            ]);
        }

        Cache::forget('store_settings.shared');

        return back()->with('success', 'Settings saved.');
    }
}
