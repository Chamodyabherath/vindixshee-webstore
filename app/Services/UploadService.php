<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UploadService
{
    public function store(?UploadedFile $file, string $directory = 'commerce'): ?string
    {
        return $file ? $file->store($directory, 'public') : null;
    }

    public function replace(?UploadedFile $file, ?string $oldPath, string $directory = 'commerce'): ?string
    {
        if (! $file) {
            return $oldPath;
        }

        if ($oldPath) {
            Storage::disk('public')->delete($oldPath);
        }

        return $this->store($file, $directory);
    }
}
