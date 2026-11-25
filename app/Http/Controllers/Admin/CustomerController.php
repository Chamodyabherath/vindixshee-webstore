<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('Admin/Customers/Index', [
            'items' => User::where('role', 'customer')->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%"))->latest()->paginate(15),
        ]);
    }
}
