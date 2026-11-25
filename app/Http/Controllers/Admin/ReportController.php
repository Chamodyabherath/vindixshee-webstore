<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function __invoke(ReportService $reports): Response { return Inertia::render('Admin/Reports/Index', ['stats' => $reports->dashboard()]); }
}
